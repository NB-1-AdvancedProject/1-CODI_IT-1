import {
  defaulted,
  Infer,
  max,
  min,
  nonempty,
  number,
  object,
  size,
  string,
} from "superstruct";
import { Cuid, integerString } from "./commonStructs";

export const CreateReviewBodyStruct = object({
  rating: min(max(number(), 5), 1),
  content: size(nonempty(string()), 2, 300),
  orderItemId: Cuid,
});

export type CreateReviewBody = Infer<typeof CreateReviewBodyStruct>;

export const UpdateReviewBodyStruct = object({
  rating: min(max(number(), 5), 1),
});

export type UpdateReviewBody = Infer<typeof UpdateReviewBodyStruct>;

export const GetReviewListPageParamsStruct = object({
  page: defaulted(integerString, 1),
  limit: defaulted(integerString, 5),
});
export type GetReviewListPageParamsType = Infer<
  typeof GetReviewListPageParamsStruct
>;
