import { Transaction } from "ioredis/built/transaction";
import prisma from "../lib/prisma";
import { OrderItem } from "../types/dashboard";
import { Prisma, Product, Review } from "@prisma/client";
import {
  CreateReviewData,
  OrderItemWithOrder,
  UpdateReviewData,
} from "../lib/dto/reviewDTO";

export async function createReview(
  data: CreateReviewData,
  tx?: Prisma.TransactionClient
): Promise<Review> {
  const client = tx || prisma;
  return await client.review.create({ data });
}

export async function findReviewByOrderItemId(
  orderItemId: string,
  tx?: Prisma.TransactionClient
): Promise<Review | null> {
  const client = tx || prisma;
  return await client.review.findUnique({ where: { orderItemId } });
}

export async function updateReview(
  data: UpdateReviewData,
  reviewId: string,
  tx?: Prisma.TransactionClient
): Promise<Review> {
  const client = tx || prisma;
  return await client.review.update({ where: { id: reviewId }, data });
}

export async function findReviewById(
  reviewId: string,
  tx?: Prisma.TransactionClient
): Promise<Review | null> {
  const client = tx || prisma;
  return await client.review.findUnique({ where: { id: reviewId } });
}

export async function findReviewsByProductId(
  productId: string,
  pageParams: Prisma.ReviewFindManyArgs,
  tx?: Prisma.TransactionClient
): Promise<Review[]> {
  const client = tx || prisma;
  return await client.review.findMany({ where: { productId }, ...pageParams });
}

export async function deleteReviewById(
  reviewId: string,
  tx?: Prisma.TransactionClient
) {
  const client = tx || prisma;
  return await client.review.delete({ where: { id: reviewId } });
}

// 정은: 다른 도메인 관련 함수
export async function updateProduct(
  data: Prisma.ProductUpdateInput,
  productId: string,
  updatedAt: Date,
  tx?: Prisma.TransactionClient
) {
  const client = tx || prisma;
  return await client.product.updateMany({
    where: {
      id: productId,
      updatedAt,
    },
    data: data,
  });
}

export async function findOrderItemById(
  orderItemId: string,
  tx?: Prisma.TransactionClient
): Promise<OrderItemWithOrder | null> {
  const client = tx || prisma;
  return await client.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: true },
  });
}

export async function findProductById(
  productId: string,
  tx?: Prisma.TransactionClient
): Promise<Product | null> {
  const client = tx || prisma;
  return await client.product.findUnique({ where: { id: productId } });
}
