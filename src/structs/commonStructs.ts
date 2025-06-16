import {
  coerce,
  integer,
  object,
  string,
  defaulted,
  optional,
  enums,
  nonempty,
  define,
  Infer,
  pattern,
} from 'superstruct';
export const emailRegExp = pattern(
  string(),
  // /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
  /^[\w.-]+@([\w.-]+\.)+[\w]{2,4}$/i,
);

export const phoneNumberRegExp = pattern(string(), /^\d{2,3}-\d{3,4}-\d{4}$/);

export const integerString = coerce(integer(), string(), (value) => parseInt(value));

export const CarIdParamsStruct = object({
  carId: integerString,
});

const urlRegExp = /^(https?:\/\/)/;

export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 10),
  searchBy: optional(string()),
  keyword: optional(string()),
});
export type PageParamsType = Infer<typeof PageParamsStruct>;

export const SearchParamsStruct = object({
  searchBy: nonempty(string()),
  keyword: optional(string()),
});
export type SearchParamsType = Infer<typeof SearchParamsStruct>;
