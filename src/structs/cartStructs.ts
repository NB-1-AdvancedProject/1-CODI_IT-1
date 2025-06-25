import { object, string, number, array, Infer } from "superstruct";

const sizeStruct = object({
  sizeId: string(),
  quantity: number(),
});

export const addToCartBodyStuct = object({
  productId: string(),
  sizes: array(sizeStruct),
});

export type cartBodyType = Infer<typeof addToCartBodyStuct>;
