// Request

import { Product } from "@prisma/client";
import { Decimal, TypedSql } from "@prisma/client/runtime/library";

// Response
export class RecommendationDTO {
  productId: string;
  recommendations: Product[];

  constructor(productId: string, products: Product[]) {
    this.productId = productId;
    this.recommendations = products;
  }
}

// 이외 도메인

export type RecommendationItem = {
  id: string;
  score: number;
};

export type RecommendationValue = {
  productId: string;
  items: RecommendationItem[];
};
