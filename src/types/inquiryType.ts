import { InquiryStatus, Inquiry, Reply } from "@prisma/client";
import { User } from "./user";

// Entity

export interface Inquirys {
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

export interface Replys {
  id: string;
  inquiryId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: ReplyUser;
}

export type ReplyUser = Pick<User, "id" | "name">; //김: reply dto용

export interface InquiryDetailQueryResult extends Inquiry {
  user: { name: string };
  Reply?: (Reply & { user: { name: string } }) | null;
}

export interface InReplyType {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
  };
}
