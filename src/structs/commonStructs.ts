import {
  coerce,
  integer,
  object,
  string,
  defaulted,
  optional,
  nonempty,
  Infer,
  pattern,
  size,
  define,
  union,
  number,
} from "superstruct";
export const emailRegExp = pattern(
  string(),
  // /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
  /^[\w.-]+@([\w.-]+\.)+[\w]{2,4}$/i
);

export const Cuid = define<string>(
  "Cuid",
  (value) => typeof value === "string" && /^c[^\s]{8,}$/.test(value)
);

export const phoneNumberRegExp = pattern(string(), /^\d{2,3}-\d{3,4}-\d{4}$/);

export const integerString = coerce(
  integer(),
  union([string(), number()]),
  (value) => parseInt(value.toString())
);

export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 10),
  search: optional(string()),
  searchBy: optional(string()),
});
export type PageParamsType = Infer<typeof PageParamsStruct>;

export const IdParamsStruct = object({
  id: Cuid,
});
export type IdParams = Infer<typeof IdParamsStruct>;

export const SearchParamsStruct = object({
  // 고급프로젝트에선 많이 사용 안되서 삭제 고려중
  search: nonempty(string()),
  searchBy: optional(string()),
});
export type SearchParamsType = Infer<typeof SearchParamsStruct>;
