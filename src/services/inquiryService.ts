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
} from "../lib/dto/inquiryDto";
import NotFoundError from "../lib/errors/NotFoundError";
import UnauthError from "../lib/errors/UnauthError";
import userRepository from "../repositories/userRepository";
import { getStoreById } from "../repositories/storeRepository";
import { Store } from "../types/storeType";
import { User } from "@prisma/client";
import productRepository from "../repositories/productRepository";
import { createAlarmData } from "../repositories/notificationRepository";

export async function getList(
  params: inquiryType,
  userId: string
): Promise<InquiryListResponseDTO> {
  const userData = await userRepository.findById(userId);

  if (!userData) {
    throw new NotFoundError("User", userId);
  }

  const list = await listData(params, userId);

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

    if (userData.storeId) {
      storeUser = await getStoreById(userData.storeId);
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
    throw new UnauthError();
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

    if (userData.storeId) {
      storeUser = await getStoreById(userData.storeId);
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

  if (userData.storeId) {
    const storeId = await getStoreById(userData.storeId);
    if (userData.type === "SELLER" && product.storeId === storeId.id) {
      throw new UnauthError();
    }
  }

  const quiryData = await postData(params, quiry, user);

  if (quiryData) {
    const storeData = await getStoreById(product.storeId);
    const content = "문의가 등록되었습니다.";
    await createAlarmData(storeData.userId, content);
  }

  return new InquiryResDTO(quiryData);
}

export async function quiryList(params: string): Promise<GetInquiryResDTO[]> {
  const data = await listQuiries(params);

  if (!data || data.length === 0) {
    throw new NotFoundError("Product", params);
  }

  return data.map((inquiry) => {
    return new GetInquiryResDTO(inquiry);
  });
}
