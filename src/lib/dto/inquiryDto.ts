import { InquiryStatus } from "@prisma/client";
import { Inquiry } from "../../types/inquiryType";

export interface InquiryListResponseDTO {
  list: InquiryItem[];
  totalCount: number;
}

export interface InquiryItem {
  id: string;
  title: string;
  isSecret: boolean;
  status: InquiryStatus;
  product: {
    id: string;
    name: string;
    image: string;
    store: {
      id: string;
      name: string;
    };
  };
}

export class InquiryResDTO {
  id: string;
  userId: string;
  productId: string;
  title: string;
  content: string;
  status: InquiryStatus;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(inquiry: Inquiry) {
    this.id = inquiry.id;
    this.userId = inquiry.userId;
    this.productId = inquiry.productId;
    this.title = inquiry.title;
    this.content = inquiry.content;
    this.status = inquiry.status;
    this.isSecret = inquiry.isSecret;
    this.createdAt = inquiry.createdAt.toISOString();
    this.updatedAt = inquiry.updatedAt.toISOString();
  }
}
