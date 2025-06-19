import {
  object,
  string,
  optional,
  Infer,
  defaulted,
  boolean,
  partial,
} from "superstruct";
import { integerString } from "./commonStructs";

export const inquiryStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 10),
  status: optional(string()),
});

export const patchInquiryStruct = object({
  title: string(),
  content: string(),
  isSecret: boolean(),
});

export const replyContentStruct = object({
  content: string(),
});

export type inquiryType = Infer<typeof inquiryStruct>;
export const updateInquiryStruct = partial(patchInquiryStruct);
export type updateInquiryType = Infer<typeof updateInquiryStruct>;
export type replyContentType = Infer<typeof replyContentStruct>;
