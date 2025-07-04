import {
  nonempty,
  object,
  optional,
  partial,
  refine,
  size,
  string,
} from "superstruct";

const phoneNumber = refine(
  size(nonempty(string()), 9, 20),
  "phoneNumber",
  (value) => /^0\d{1,2}-\d{3,4}-\d{4}$/.test(value)
);

export const CreateStoreBodyStruct = object({
  name: size(nonempty(string()), 2, 50),
  address: size(nonempty(string()), 2, 100),
  phoneNumber: phoneNumber,
  content: size(nonempty(string()), 2, 300),
  image: optional(size(string(), 0, 2048)),
});

export const UpdateStoreBodyStruct = partial(CreateStoreBodyStruct);
