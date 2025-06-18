import { object, string, optional, Infer, defaulted } from "superstruct";
import { integerString } from "./commonStructs";

export const inquiryStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 10),
  status: optional(string()),
});

export type inquiryType = Infer<typeof inquiryStruct>;
