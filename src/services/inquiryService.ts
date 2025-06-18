import { listData, patchData } from "../repositories/inquiryRepository";
import { updateInquiryType, inquiryType } from "../structs/inquiryStructs";
import { countData } from "../repositories/inquiryRepository";
import {
  InquiryListResponseDTO,
  UpdateInquiryResDTO,
} from "../lib/dto/inquiryDto";
import userRepository from "../repositories/userRepository";
import NotFoundError from "../lib/errors/NotFoundError";
import ForbiddenError from "../lib/errors/ForbiddenError";

export async function getList(
  params: inquiryType,
  userId: string
): Promise<InquiryListResponseDTO> {
  //user 디비에 있는지 확인;
  //없으면 오류
  const list = await listData(params, userId);

  const totalCount = await countData(userId);

  return { list, totalCount };
}

export async function patchInquiry(
  params: string,
  userId: string,
  inquiry: updateInquiryType
): Promise<UpdateInquiryResDTO> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("User", userId);
  }

  const data = await patchData(params, inquiry);
  return new UpdateInquiryResDTO(data);
}
