import {
  listData,
  patchData,
  getData,
  delInquiry,
  createReply,
  getReplyData,
  patchReplay,
  inquiryDetail,
  replyDetail,
  inquiryStatus,
  postData,
  countData,
  listQuiries,
  sellerIncludeMany,
} from "../repositories/inquiryRepository";
import {
  updateInquiryType,
  inquiryType,
  inquiresType,
} from "../structs/inquiryStructs";
import {
  InquiryListResponseDTO,
  InquiryResDTO,
  replyResDTO,
  GetInquiryResDTO,
  InquiryItem,
} from "../lib/dto/inquiryDto";
import NotFoundError from "../lib/errors/NotFoundError";
import UnauthError from "../lib/errors/UnauthError";
import userRepository from "../repositories/userRepository";
import {
  getStoreByUser,
  getStoreById,
  getStoreProducts,
} from "../repositories/storeRepository";
import { Store } from "../types/storeType";
import { User } from "@prisma/client";
import productRepository from "../repositories/productRepository";
import { createAlarmData } from "../repositories/notificationRepository";
import ForbiddenError from "../lib/errors/ForbiddenError";

export async function getList(
  params: inquiryType,
  userId: string
): Promise<InquiryListResponseDTO> {
  let inquiries;
  const userData = await userRepository.findById(userId);

  if (!userData) {
    throw new NotFoundError("User", userId);
  }

  if (userData.type === "BUYER") {
    inquiries = await listData(params, userId);
  } else if (userData.type === "SELLER") {
    const store = await getStoreProducts(userId);

    if (!store) {
      throw new NotFoundError("Store", userId);
    }

    const productIds = store.products.map((product) => product.id);

    inquiries = await sellerIncludeMany(productIds, params);
  } else {
    throw new Error("Invalid user type");
  }

  if (inquiries.length === 0) {
    return { list: [], totalCount: 0 };
  }

  const list = inquiries.map((inquiry) => new InquiryItem(inquiry));

  const totalCount = await countData(userId);

  return { list, totalCount };
}

export async function patchInquiry(
  params: string,
  userId: string,
  inquiry: updateInquiryType
): Promise<InquiryResDTO> {
  const inquirys = await getData(params);

  if (!inquirys) {
    throw new NotFoundError("Inquiry", params);
  }
  if (inquirys.userId !== userId) {
    throw new UnauthError();
  }
  const data = await patchData(params, inquiry);
  return new InquiryResDTO(data);
}

export async function deleteData(
  params: string,
  user: string
): Promise<InquiryResDTO> {
  const inquiry = await getData(params);

  if (!inquiry) {
    throw new NotFoundError("Inquiry", params);
  }

  if (inquiry.userId !== user) {
    throw new UnauthError();
  }

  await delInquiry(inquiry.id);

  return new InquiryResDTO(inquiry);
}

export async function createRepliesData(
  user: string,
  params: string,
  reply: string
): Promise<replyResDTO> {
  const userData = await userRepository.findById(user);

  if (!userData) {
    throw new NotFoundError("User", user);
  }
  if (userData.type === "BUYER") {
    throw new UnauthError();
  }

  const inquiry = await getData(params);

  if (!inquiry) {
    throw new NotFoundError("Inquiry", params);
  }

  const replies = await createReply(user, params, reply);

  if (replies) {
    const content = "문의 답변이 완료되었습니다.";
    await createAlarmData(inquiry.userId, content);
  }

  await inquiryStatus(replies.inquiryId);

  return new replyResDTO(replies);
}

export async function updateRepliesData(
  user: string,
  params: string,
  reply: string
): Promise<replyResDTO> {
  const userData = await userRepository.findById(user);

  if (!userData) {
    throw new NotFoundError("User", user);
  }
  if (userData.type === "BUYER") {
    throw new UnauthError();
  }

  const replyId = await getReplyData(params);
  if (!replyId) {
    throw new NotFoundError("Reply", params);
  }

  if (replyId.userId !== userData.id) {
    throw new UnauthError();
  }

  const replayData = await patchReplay(params, reply);

  return new replyResDTO(replayData);
}

export async function getDetail(params: string, user?: string) {
  let userData: User | null = null;
  let storeUser: Store | null = null;
  if (user !== undefined) {
    userData = await userRepository.findById(user);
    if (!userData) {
      throw new NotFoundError("User", user);
    }
    if (userData.type === "SELLER") {
      storeUser = await getStoreByUser(userData.id);
    }
  }

  const inquiry = await inquiryDetail(params, user);

  if (!inquiry) {
    throw new NotFoundError("Inquiry", params);
  }

  if (
    inquiry.isSecret &&
    user !== undefined &&
    !(inquiry.userId === user || storeUser?.userId === user)
  ) {
    throw new ForbiddenError();
  }

  return new GetInquiryResDTO(inquiry);
}

export async function getReply(params: string, user?: string) {
  let userData: User | null = null;
  let storeUser: Store | null = null;

  if (user !== undefined) {
    userData = await userRepository.findById(user);

    if (!userData) {
      throw new NotFoundError("User", user);
    }

    if (userData.type === "SELLER") {
      storeUser = await getStoreByUser(userData.id);
    }
  }

  const reply = await replyDetail(params);

  if (!reply) {
    throw new NotFoundError("Reply", params);
  }

  const inquiry = await inquiryDetail(reply.inquiryId, user);

  if (!inquiry) {
    throw new NotFoundError("Inquiry", reply.inquiryId);
  }

  if (
    inquiry.isSecret &&
    user !== undefined &&
    !(
      reply.userId === user ||
      inquiry.userId === user ||
      storeUser?.userId === user
    )
  ) {
    throw new UnauthError();
  }

  return new GetInquiryResDTO(inquiry);
}

export async function postQuiry(
  params: string,
  quiry: inquiresType,
  user: string
): Promise<InquiryResDTO> {
  const userData = await userRepository.findById(user);

  if (!userData) {
    throw new NotFoundError("User", user);
  }

  const product = await productRepository.findProductById(params);
  if (!product) {
    throw new NotFoundError("Product", params);
  }

  if (userData.type === "SELLER") {
    const storeId = await getStoreByUser(userData.id);
    if (userData.type === "SELLER" && product.storeId === storeId.id) {
      throw new ForbiddenError();
    }
  }

  const quiryData = await postData(params, quiry, user);

  if (quiryData) {
    const storeData = await getStoreById(product.storeId);
    const content = `${product.name}에 새로운 문의가 등록되었습니다.`;
    await createAlarmData(storeData.userId, content);
  }

  return new InquiryResDTO(quiryData);
}

export async function quiryList(
  productId: string
): Promise<{ list: GetInquiryResDTO[]; totalCount: number }> {
  const data = await listQuiries(productId);

  if (!data || data.length === 0) {
    return { list: [], totalCount: 0 };
  }

  const list = data.map((inquiry) => new GetInquiryResDTO(inquiry));

  return { list, totalCount: list.length };
}
