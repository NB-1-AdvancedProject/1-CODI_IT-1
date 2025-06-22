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

export const inquiresStruct = object({
  title: string(),
  content: string(),
  isSecret: boolean(),
});

export const replyContentStruct = object({
  content: string(),
});

export type inquiryType = Infer<typeof inquiryStruct>;
export const updateInquiryStruct = partial(inquiresStruct);
export type updateInquiryType = Infer<typeof updateInquiryStruct>;
export type inquiresType = Infer<typeof inquiresStruct>;
export type replyContentType = Infer<typeof replyContentStruct>;
