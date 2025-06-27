import {
  array,
  enums,
  nonempty,
  number,
  object,
  size,
  string,
  optional,
  partial,
} from "superstruct";
import { phoneNumberRegExp } from "./commonStructs";
import { OrderStatus } from "@prisma/client";

const orderStatus = enums(Object.values(OrderStatus));

export const CreateOrder = object({
  name: size(nonempty(string()), 2, 10),
  phone: phoneNumberRegExp,
  address: string(),
  orderItems: array(
    object({ productId: string(), sizeId: string(), quantity: number() })
  ),
  usePoint: number(),
});

export const UpdateOrder = partial(CreateOrder);

export const GetOrder = object({
  status: optional(orderStatus),
  limit: optional(number()),
  page: optional(number()),
  orderBy: optional(enums(["recent", "oldest"])),
});
