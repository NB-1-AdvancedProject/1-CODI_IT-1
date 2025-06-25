import { OrderStatus } from "@prisma/client";
import {
  CreateReviewDTO,
  ReviewDTO,
  UpdateReviewDTO,
} from "../lib/dto/reviewDTO";
import prisma from "../lib/prisma";
import * as reviewRepository from "../repositories/reviewRepository";
import UnauthError from "../lib/errors/UnauthError";
import NotFoundError from "../lib/errors/NotFoundError";
import { create } from "superstruct";
import AlreadyExstError from "../lib/errors/AlreadyExstError";

export async function createReview(dto: CreateReviewDTO): Promise<ReviewDTO> {
  const { orderItemId, productId, userId, rating, content } = dto;
  const allowedStatus: OrderStatus[] = [
    OrderStatus.PAID,
    OrderStatus.DELIVERED,
    OrderStatus.SHIPPED,
  ];
  const result = await prisma.$transaction(async (tx) => {
    const orderItem = await reviewRepository.findOrderItemById(orderItemId, tx);
    if (
      !orderItem ||
      orderItem.productId !== productId ||
      orderItem.order.userId !== userId ||
      !allowedStatus.includes(orderItem.order.status)
    ) {
      throw new UnauthError();
    }
    const product = await reviewRepository.findProductById(productId, tx);
    if (!product) {
      throw new NotFoundError("product", productId);
    }
    const existingReview = await reviewRepository.findReviewByOrderItemId(
      orderItemId,
      tx
    );
    if (existingReview) {
      throw new AlreadyExstError("Review");
    }
    const createdReview = await reviewRepository.createReview({
      userId,
      productId,
      orderItemId,
      rating,
      content,
    });
    // 리뷰가 생길 때마다 product 의 review 관련 필드 업데이트
    // 정은: 따로 함수로 빼도 좋을 것 같음 (가독성 떨어짐)
    const previousReviewCount = product.reviewsCount ? product.reviewsCount : 0;
    const previousReviewRating = product.reviewsRating
      ? product.reviewsRating
      : 0;
    const previousReviewRatingSum = previousReviewCount * previousReviewRating;
    const newReviewCount = previousReviewCount + 1;
    const newReviewRating = (previousReviewRatingSum + rating) / newReviewCount;
    await reviewRepository.updateProduct(
      { reviewsCount: newReviewCount, reviewsRating: newReviewRating },
      productId,
      tx
    );
    return createdReview;
  });
  return new ReviewDTO(result);
}

export async function updateReview(dto: UpdateReviewDTO): Promise<ReviewDTO> {
  const { reviewId, rating, userId } = dto;
  const result = await prisma.$transaction(async (tx) => {
    const existingReview = await reviewRepository.findReviewById(reviewId, tx);
    if (!existingReview) {
      throw new NotFoundError("Review", reviewId);
    }
    if (existingReview.userId !== userId) {
      throw new UnauthError();
    }
    if (existingReview.rating === rating) {
      return existingReview;
    }
    const updatedReview = await reviewRepository.updateReview(
      { rating },
      reviewId,
      tx
    );
    // product 의 reviewRating 업데이트
    const product = await reviewRepository.findProductById(
      updatedReview.productId,
      tx
    );
    if (!product) {
      throw new NotFoundError("Product", updatedReview.productId);
    }
    const reviewCount = product.reviewsCount ? product.reviewsCount : 0;
    const previousReviewRating = product.reviewsRating
      ? product.reviewsRating
      : 0;
    const previousReviewRatingSum = reviewCount * previousReviewRating;
    const newReviewRating =
      (previousReviewRatingSum - existingReview.rating + rating) / reviewCount;
    await reviewRepository.updateProduct(
      { reviewsRating: newReviewRating },
      product.id,
      tx
    );
    return updatedReview;
  });
  return new ReviewDTO(result);
}
