import { OrderStatus } from "@prisma/client";
import { CreateReviewDTO, ReviewDTO } from "../lib/dto/reviewDTO";
import prisma from "../lib/prisma";
import * as reviewRepository from "../repositories/reviewRepository";
import UnauthError from "../lib/errors/UnauthError";
import NotFoundError from "../lib/errors/NotFoundError";
import { create } from "superstruct";

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
    const createdReview = await reviewRepository.createReview({
      userId,
      productId,
      rating,
      content,
    });
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
