import { Order, OrderItem, Review } from "@prisma/client";
import {
  CreateReviewBody,
  UpdateReviewBody,
} from "../../structs/reviewStructs";
import { ReviewWithUser } from "../../types/reviewType";

// Request

// Response
export class ReviewDTO {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  content: string;
  createdAt: Date;

  constructor(review: Review) {
    this.id = review.id;
    this.userId = review.userId;
    this.productId = review.productId;
    this.rating = review.rating;
    this.content = review.content;
    this.createdAt = review.createdAt;
  }
}

export class ReviewListDTO {
  items: ReviewData[];
  meta: ReviewMetaData;

  constructor(
    reviews: ReviewWithUser[],
    params: {
      total: number;
      page: number;
      limit: number;
      hasNextPage: boolean;
    }
  ) {
    this.items = reviews.map((review) => ({
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      content: review.content,
      rating: review.rating,
      createdAt: review.createdAt.toISOString?.() ?? review.createdAt,
      updatedAt: review.updatedAt.toISOString?.() ?? review.updatedAt,
      orderItemId: review.orderItemId,
      user: {
        name: review.user?.name ?? "",
      },
    }));

    this.meta = {
      total: params.total,
      page: params.page,
      limit: params.limit,
      hasNextPage: params.hasNextPage,
    };
  }
}

export interface ReviewMetaData {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface ReviewData {
  id: string;
  userId: string;
  productId: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  orderItemId: string;
  user: { name: string };
}
// Input (Service <-> Repo)

export type CreateReviewData = {
  userId: string;
  productId: string;
  orderItemId: string;
  rating: number;
  content: string;
};

export type OrderItemWithOrder = OrderItem & {
  order: Order;
};

export type UpdateReviewData = {
  rating: number;
};
