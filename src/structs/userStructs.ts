import {
  object,
  string,
  coerce,
  pattern,
  optional,
  enums,
  partial,
} from "superstruct";
import { emailRegExp } from "./commonStructs";

const nameRegex = /^[a-zA-Z0-9가-힣]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,15}$/;

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
  name: coerce(pattern(string(), nameRegex), string(), (value) => value.trim()),
  password: coerce(pattern(string(), passwordRegex), string(), (value) =>
    value.trim()
  ),
  image: optional(string()),
});
