import {
  array,
  date,
  Infer,
  number,
  object,
  optional,
  string,
} from "superstruct";

export const CreateProductBodyStruct = object({
  name: string(),
  price: number(),
  content: string(),
  image: string(),
  discountRate: optional(number()),
  discountStartTime: optional(date()),
  discountEndTime: optional(date()),
  categoryName: string(),
  stocks: array(
    object({
      sizeId: string(),
      quantity: number(),
    })
  ),
});

export type CreateProductBody = Infer<typeof CreateProductBodyStruct>;
