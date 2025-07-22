import { InquiryStatus } from "@prisma/client";
import { Inquirys, Replys, InReplyType } from "../../types/inquiryType";
import { ReplyUser, InquiryDetailQueryResult } from "../../types/inquiryType";
import {
  StoreInquiryType,
  ProductInquiryType,
  InquiryType,
} from "../../types/inquiryType";

export interface InquiryListResponseDTO {
  list: InquiryItem[];
  totalCount: number;
}

export class userDataDto {
  name: string;
  constructor(user: string) {
    this.name = user;
  }
}

export class productDataDto {
  id: string;
  name: string;
  image: string;
  store: storeDataDto;

  constructor(product: ProductInquiryType) {
    this.id = product.id;
    this.name = product.name;
    this.image = product.image;
    this.store = {
      id: product.store.id,
      name: product.store.name,
    };
  }
}

export class storeDataDto {
  id: string;
  name: string;

  constructor(store: StoreInquiryType) {
    this.id = store.id;
    this.name = store.name;
  }
}

export class InquiryItem {
  id: string;
  title: string;
  isSecret: boolean;
  status: InquiryStatus;
  product: productDataDto;
  user: userDataDto;
  createdAt: string;
  content: string;

  constructor(inquiry: InquiryType) {
    this.id = inquiry.id;
    this.title = inquiry.title;
    this.isSecret = inquiry.isSecret;
    this.status = inquiry.status;
    this.product = {
      id: inquiry.product.id,
      name: inquiry.product.name,
      image: inquiry.product.image,
      store: {
        id: inquiry.product.store.id,
        name: inquiry.product.store.name,
      },
    };
    this.user = {
      name: inquiry.user.name,
    };
    this.createdAt = inquiry.createdAt.toISOString();
    this.content = inquiry.content;
  }
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

  constructor(inquiry: Inquirys) {
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

export class replyResDTO {
  id: string;
  inquiryId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: ReplyUser;

  constructor(reply: Replys) {
    this.id = reply.id;
    this.inquiryId = reply.inquiryId;
    this.userId = reply.userId;
    this.content = reply.content;
    this.createdAt = reply.createdAt.toISOString();
    this.updatedAt = reply.updatedAt.toISOString();
    this.user = {
      id: reply.user.id,
      name: reply.user.name,
    };
  }
}

export class GetInquiryResDTO {
  id: string;
  userId: string;
  productId: string;
  title: string;
  content: string;
  status: InquiryStatus;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;
  user: { name: string };
  reply: InReplyType | null;

  constructor(inquiry: InquiryDetailQueryResult) {
    this.id = inquiry.id;
    this.userId = inquiry.userId;
    this.productId = inquiry.productId;
    this.title = inquiry.title;
    this.content = inquiry.content;
    this.status = inquiry.status;
    this.isSecret = inquiry.isSecret;
    this.createdAt = inquiry.createdAt.toISOString();
    this.updatedAt = inquiry.updatedAt.toISOString();

    this.user = {
      name: inquiry.user.name,
    };

    this.reply = inquiry.Reply
      ? {
          id: inquiry.Reply.id,
          content: inquiry.Reply.content,
          createdAt: inquiry.Reply.createdAt.toISOString(),
          updatedAt: inquiry.Reply.updatedAt.toISOString(),
          user: {
            name: inquiry.Reply.user.name,
          },
        }
      : null;
  }
}
