import bcrypt from "bcrypt";
import NotFoundError from "../lib/errors/NotFoundError";
import userRepository from "../repositories/userRepository";
import authService from "./authService";
import { User } from "../types/user";
import { CreateUserDTO, UserResDTO } from "../lib/dto/userDTO";
import AlreadyExstError from "../lib/errors/AlreadyExstError";

async function hashingPassword(password: string) {
  return bcrypt.hash(password, 10);
}

function filterSensitiveUserData(user: User) {
  const { password, ...rest } = user;
  return rest;
}

async function getById(id: string) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError("User", id);
  }

  return filterSensitiveUserData(user);
}
async function getByEmail(email: string) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new NotFoundError("User", email);
  }

  return filterSensitiveUserData(user);
}

async function getUser(email: string, password: string) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new NotFoundError("User", email);
  }

  await authService.verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

async function createUser(data: CreateUserDTO) {
  const email = await userRepository.findByEmail(data.email);

  if (email) {
    throw new AlreadyExstError(`${email}`);
  }

  const hashedPassword = await hashingPassword(data.password);
  const createdUser = await userRepository.save({
    ...data,
    password: hashedPassword,
  });

  return new UserResDTO(createdUser);
}

async function getMydata(userId: string) {
  const data = await userRepository.findById(userId);

  if (!data) {
    throw new NotFoundError("User", userId);
  }
  return new UserResDTO(data);
}
export default { getUser, getById, getByEmail, createUser, getMydata };
