import {
  listData,
  patchData,
  getData,
  delInquiry,
} from "../repositories/inquiryRepository";
import { updateInquiryType, inquiryType } from "../structs/inquiryStructs";
import { countData } from "../repositories/inquiryRepository";
import { InquiryListResponseDTO, InquiryResDTO } from "../lib/dto/inquiryDto";
import NotFoundError from "../lib/errors/NotFoundError";
import UnauthError from "../lib/errors/UnauthError";

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
