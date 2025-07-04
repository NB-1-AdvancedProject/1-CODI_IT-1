import {
  array,
  boolean,
  date,
  defaulted,
  Infer,
  number,
  object,
  optional,
  string,
} from "superstruct";
import { integerString } from "./commonStructs";

export const CreateProductBodyStruct = object({
  name: string(),
  price: integerString,
  content: string(),
  image: string(),
  discountRate: optional(number()),
  discountStartTime: optional(date()),
  discountEndTime: optional(date()),
  categoryName: string(),
  stocks: array(
    object({
      sizeId: string(),
      quantity: integerString,
    })
  ),
});

export type CreateProductBody = Infer<typeof CreateProductBodyStruct>;

export const PatchProductBodyStruct = object({
  name: optional(string()),
  price: optional(integerString),
  content: optional(string()),
  image: optional(string()),
  discountRate: optional(integerString),
  discountStartTime: optional(string()),
  discountEndTime: optional(string()),
  categoryName: optional(string()),
  stocks: optional(
    array(
      object({
        sizeId: string(),
        quantity: integerString,
      })
    )
  ),
  isSoldOut: optional(boolean()),
});

export type PatchProductBody = Infer<typeof PatchProductBodyStruct>;

export const ProductListParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 16),
  search: optional(string()),
  searchBy: optional(string()),
  sort: optional(string()),
  priceMin: defaulted(integerString, 0),
  priceMax: defaulted(integerString, 2147483647),
  favoriteStore: optional(string()),
  size: optional(string()),
  categoryName: optional(string()),
});

export type ProductListParams = Infer<typeof ProductListParamsStruct>;
