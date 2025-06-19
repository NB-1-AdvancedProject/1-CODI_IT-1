import {
  getList,
  patchInquiry,
  deleteData,
  createRepliesData,
  updateRepliesData,
} from "../services/inquiryService";
import { create } from "superstruct";
import { inquiryStruct, replyContentStruct } from "../structs/inquiryStructs";
import { IdParamsStruct } from "../structs/commonStructs";
import {
  InquiryListResponseDTO,
  InquiryResDTO,
  replyResDTO,
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
  const { id: params } = create(req.params, IdParamsStruct);
  const user = req.user.id;
  const inquiry = req.body;
  const result: InquiryResDTO = await patchInquiry(params, user, inquiry);

  res.status(200).json(result);
  return;
};

export const deleteInquiry: RequestHandler = async (req, res) => {
  const { id: params } = create(req.params, IdParamsStruct);
  const user = req.user.id;

  const result: InquiryResDTO = await deleteData(params, user);

  res.status(200).json(result);
  return;
};

export const createReplies: RequestHandler = async (req, res) => {
  const user = req.user.id;
  const { id: params } = create(req.params, IdParamsStruct);
  const { content: reply } = create(req.body, replyContentStruct);

  const result: replyResDTO = await createRepliesData(user, params, reply);

  res.status(201).json(result);
  return;
};

export const patchReplies: RequestHandler = async (req, res) => {
  const { id: params } = create(req.params, IdParamsStruct);
  const { content: reply } = create(req.body, replyContentStruct);
  const user = req.user.id;

  const result: replyResDTO = await updateRepliesData(user, params, reply);

  res.status(200).json(result);
  return;
};
