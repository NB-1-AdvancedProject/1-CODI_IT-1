import { Order, OrderItem, Review } from "@prisma/client";
import {
  CreateReviewBody,
  UpdateReviewBody,
} from "../../structs/reviewStructs";

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
