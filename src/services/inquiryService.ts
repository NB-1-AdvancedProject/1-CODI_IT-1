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
} from "../repositories/inquiryRepository";
import { updateInquiryType, inquiryType } from "../structs/inquiryStructs";
import { countData } from "../repositories/inquiryRepository";
import {
  InquiryListResponseDTO,
  InquiryResDTO,
  replyResDTO,
  GetInquiryResDTO,
} from "../lib/dto/inquiryDto";
import NotFoundError from "../lib/errors/NotFoundError";
import UnauthError from "../lib/errors/UnauthError";
import userRepository from "../repositories/userRepository";

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
  let userData = undefined;
  console.log("서비스 파라미터 확인", params, user);
  if (user !== undefined) {
    userData = await userRepository.findById(user);
    console.log("유저데이터 작동 확인", userData);
    if (!userData) {
      throw new NotFoundError("User", user);
    }
  }

  const inquiry = await inquiryDetail(params, user);
  console.log("문의데이터 작동 확인", inquiry);

  if (!inquiry) {
    console.log("에러 전 마지막 메시지");
    throw new NotFoundError("Inquiry", params);
  }

  if (inquiry.isSecret && user !== undefined && inquiry.userId !== user) {
    console.log("권한 문제 확인");
    throw new UnauthError();
  }

  return new GetInquiryResDTO(inquiry);
}

export async function getReply(params: string, user?: string) {
  let userData = undefined;

  if (user !== undefined) {
    userData = await userRepository.findById(user);

    if (!userData) {
      throw new NotFoundError("User", user);
    }
  }

  const reply = await replyDetail(params);

  if (!reply) {
    throw new NotFoundError("Reply", params);
  }

  const inquiry = await inquiryDetail(reply.inquiryId);

  if (!inquiry) {
    throw new NotFoundError("Inquiry", reply.inquiryId);
  }

  if (inquiry.isSecret && user !== undefined && reply.userId !== user) {
    throw new UnauthError();
  }

  return new GetInquiryResDTO(inquiry);
}
