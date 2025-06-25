import { max, min, nonempty, number, object, size, string } from "superstruct";
import { Cuid } from "./commonStructs";

export const CreateReviewBodyStruct = object({
  rating: min(max(number(), 5), 1),
  content: size(nonempty(string()), 2, 300),
  orderItemId: Cuid,
});

export const UpdateReviewBodyStruct = object({
  rating: min(max(number(), 5), 1),
});
