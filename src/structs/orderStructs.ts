import { array, nonempty, number, object, size, string } from "superstruct";
import { phoneNumberRegExp } from "./commonStructs";

export const CreateOrder = object({
  name: size(nonempty(string()), 2, 10),
  phone: phoneNumberRegExp,
  address: string(),
  orderItems: array(
    object({ productId: string(), sizeId: string(), quantity: number() })
  ),
  usePoint: number(),
});
