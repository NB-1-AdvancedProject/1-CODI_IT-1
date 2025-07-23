import { object, string, coerce, pattern, optional, enums } from "superstruct";
import { emailRegExp } from "./commonStructs";

const nameRegex = /^[a-zA-Z0-9가-힣]+$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const UserType = enums(["BUYER", "SELLER"]);

export const CreateUser = object({
  name: coerce(pattern(string(), nameRegex), string(), (value) => value.trim()),
  email: emailRegExp,
  password: coerce(pattern(string(), passwordRegex), string(), (value) =>
    value.trim()
  ),
  image: optional(string()),
  type: UserType,
});

export const UpdateUser = object({
  name: optional(
    coerce(pattern(string(), nameRegex), string(), (value) => value.trim())
  ),
  password: optional(
    coerce(pattern(string(), passwordRegex), string(), (value) => value.trim())
  ),
  image: optional(string()),
});
