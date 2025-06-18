import { getList, patchInquiry } from "../services/inquiryService";
import { create } from "superstruct";
import { inquiryStruct } from "../structs/inquiryStructs";
import {
  InquiryListResponseDTO,
  UpdateInquiryResDTO,
} from "../lib/dto/inquiryDto";
import { RequestHandler } from "express";

export const getInquiry: RequestHandler = async (req, res) => {
  const params = create(req.query, inquiryStruct);
  const userId = req.user.id;

  const { list, totalCount } = await getList(params, userId);

  const response: InquiryListResponseDTO = {
    list,
    totalCount,
  };

  res.status(200).json(response);
};

export const changeInquiry: RequestHandler = async (req, res) => {
  const params = req.params.id;
  const user = req.user.id;
  const inquiry = req.body;
  const result: UpdateInquiryResDTO = await patchInquiry(params, user, inquiry);

  res.status(200).json(result);
  return;
};
