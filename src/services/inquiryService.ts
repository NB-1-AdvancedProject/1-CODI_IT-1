import { listData } from "../repositories/inquiryRepository";
import { inquiryType } from "../structs/inquiryStructs";
import { countData } from "../repositories/inquiryRepository";
import { InquiryListResponseDTO } from "../lib/dto/inquiryDto";

export async function getList(
  params: inquiryType,
  userId: string
): Promise<InquiryListResponseDTO> {
  //user 디비에 있는지 확인;
  //없으면 오류
  const list = await listData(params, userId);

  const totalCount = await countData(params, userId);

  return { list, totalCount };
}
