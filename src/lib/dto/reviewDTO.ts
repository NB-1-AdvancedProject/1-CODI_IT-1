import { Order, OrderItem, Review } from "@prisma/client";

// Request
export type CreateReviewDTO = {
  productId: string;
  userId: string;
  rating: number;
  content: string;
  orderItemId: string;
};
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
  rating: number;
  content: string;
};

export type OrderItemWithOrder = OrderItem & {
  order: Order;
};
