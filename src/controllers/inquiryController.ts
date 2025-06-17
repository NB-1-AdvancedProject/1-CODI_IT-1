import { Request, Response } from "express";
import { getList } from "../services/inquiryService";
import { create } from "superstruct";
import { inquiryStruct } from "../structs/inquiryStructs";
import { asyncHandler } from "../middleware/asyncHandler";
import { InquiryListResponseDTO } from "../lib/dto/inquiryDto";

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
    }
  }
}

export const getInquiry = asyncHandler(async (req: Request, res: Response) => {
  const params = create(req.query, inquiryStruct);
  const userId = req.user.id;
  const { list, totalCount } = await getList(params, userId);

  const response: InquiryListResponseDTO = {
    list,
    totalCount,
  };

  res.status(200).json(response);
});
