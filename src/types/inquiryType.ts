import { InquiryStatus } from "@prisma/client";
import { User } from "./user";

// Entity

export interface Inquiry {
  id: string;
  userId: string;
  productId: string;
  title: string;
  content: string;
  status: InquiryStatus;
  isSecret: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reply {
  id: string;
  inquiryId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: ReplyUser;
}

export type ReplyUser = Pick<User, "id" | "name">; //김: reply dto용
