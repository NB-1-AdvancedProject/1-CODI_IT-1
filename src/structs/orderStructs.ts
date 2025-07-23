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
  coerce,
} from "superstruct";
import { phoneNumberRegExp } from "./commonStructs";
import { OrderStatus } from "@prisma/client";

const orderStatus = enums(Object.values(OrderStatus));

export const CreateOrder = object({
  name: size(nonempty(string()), 2, 10),
  phone: phoneNumberRegExp,
  address: string(),
  orderItems: array(
    object({ productId: string(), sizeId: number(), quantity: number() })
  ),
  usePoint: number(),
});

export const UpdateOrder = partial(CreateOrder);

const CoercedNumber = coerce(number(), string(), (value) => Number(value));

export const GetOrder = object({
  status: optional(orderStatus),
  limit: optional(CoercedNumber),
  page: optional(CoercedNumber),
  orderBy: optional(enums(["recent", "oldest"])),
});
