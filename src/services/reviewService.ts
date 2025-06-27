import { OrderStatus, Prisma } from "@prisma/client";
import { ReviewDTO } from "../lib/dto/reviewDTO";
import prisma from "../lib/prisma";
import * as reviewRepository from "../repositories/reviewRepository";
import UnauthError from "../lib/errors/UnauthError";
import NotFoundError from "../lib/errors/NotFoundError";
import { create } from "superstruct";
import AlreadyExstError from "../lib/errors/AlreadyExstError";
import {
  CreateReviewBody,
  GetReviewListPageParamsType,
  UpdateReviewBody,
} from "../structs/reviewStructs";
import { INITIAL_BACKOFF_MS, MAX_RETRIES } from "../lib/constants";
import OptimisticLockFailedError from "../lib/errors/OptimisticLockFailedError";

export async function createReview(
  reviewData: CreateReviewBody,
  userId: string,
  productId: string
): Promise<ReviewDTO> {
  const { orderItemId, rating, content } = reviewData;
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
    const updatedAt = product.updatedAt;
    const existingReview = await reviewRepository.findReviewByOrderItemId(
      orderItemId,
      tx
    );
    if (existingReview) {
      throw new AlreadyExstError("Review");
    }
    const createdReview = await reviewRepository.createReview(
      {
        userId,
        productId,
        orderItemId,
        rating,
        content,
      },
      tx
    );
    // 리뷰가 생길 때마다 product 의 review 관련 필드 업데이트
    await updateProductReviewFields(productId, updatedAt, tx);
    return createdReview;
  });
  return new ReviewDTO(result);
}

export async function updateReview(
  reviewData: UpdateReviewBody,
  userId: string,
  reviewId: string
): Promise<ReviewDTO> {
  const { rating } = reviewData;
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
    const product = await reviewRepository.findProductById(
      updatedReview.productId,
      tx
    );
    if (!product) {
      throw new NotFoundError("Product", updatedReview.productId);
    }
    const updatedAt = product.updatedAt;
    await updateProductReviewFields(product.id, updatedAt, tx);
    return updatedReview;
  });
  return new ReviewDTO(result);
}

export async function getReviewInfo(reviewId: string): Promise<ReviewDTO> {
  const review = await reviewRepository.findReviewById(reviewId);
  if (!review) {
    throw new NotFoundError("Review", reviewId);
  }
  return new ReviewDTO(review);
}

export async function deleteReview(
  reviewId: string,
  userId: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const review = await reviewRepository.findReviewById(reviewId, tx);
    if (!review) {
      throw new NotFoundError("Review", reviewId);
    }
    if (review.userId !== userId) {
      throw new UnauthError();
    }
    const product = await reviewRepository.findProductById(
      review.productId,
      tx
    );
    if (!product) {
      throw new NotFoundError("Product", review.productId);
    }
    const updatedAt = product.updatedAt;
    await reviewRepository.deleteReviewById(reviewId, tx);
    await updateProductReviewFields(review.productId, updatedAt, tx);
  });
}

export async function getReviewList(
  productId: string,
  params: GetReviewListPageParamsType
): Promise<ReviewDTO[]> {
  const product = await reviewRepository.findProductById(productId);
  if (!product) {
    throw new NotFoundError("Review", productId);
  }
  const pageParams = { take: params.limit, skip: params.page - 1 };
  const reviews = await reviewRepository.findReviewsByProductId(
    productId,
    pageParams
  );
  return reviews.map((review) => new ReviewDTO(review));
}

// 헬퍼 함수
async function updateProductReviewFields(
  productId: string,
  updatedAt: Date,
  tx: Prisma.TransactionClient
): Promise<void> {
  let retries = 0;
  let success = false;

  while (retries < MAX_RETRIES && !success) {
    try {
      const reviews = await reviewRepository.findReviewsByProductId(
        productId,
        {},
        tx
      );

      const newReviewCount = reviews.length;
      const reviewRatingSum = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const newReviewRating =
        newReviewCount > 0 ? reviewRatingSum / newReviewCount : 0;

      const updateResult = await reviewRepository.updateProduct(
        { reviewsCount: newReviewCount, reviewsRating: newReviewRating },
        productId,
        updatedAt,
        tx
      );
      if (updateResult.count === 0) {
        throw new Prisma.PrismaClientKnownRequestError(
          "Optimistic lock conflict",
          { code: "P2002", clientVersion: "6.9.0" }
        );
      }
      success = true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.message.includes("Optimistic lock conflict")
      ) {
        retries++;
        if (retries >= MAX_RETRIES) {
          throw new OptimisticLockFailedError(
            `Failed to update product ${productId} after ${MAX_RETRIES} retries.`
          );
        }
        const backoffTime = INITIAL_BACKOFF_MS * Math.pow(2, retries - 1);
        console.warn(
          `Optimistic lock conflict for product ${productId}. Retrying (${retries}/${MAX_RETRIES}) in ${backoffTime}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      } else {
        throw error;
      }
    }
  }
}
