import bcrypt from "bcrypt";
import NotFoundError from "../lib/errors/NotFoundError";
import userRepository from "../repositories/userRepository";
import authService from "./authService";
import { User } from "../types/user";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResDTO,
  FavoriteResDTO,
} from "../lib/dto/userDTO";
import AlreadyExstError from "../lib/errors/AlreadyExstError";
import UnauthError from "../lib/errors/UnauthError";
import { StoreResDTO } from "../lib/dto/storeDTO";

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

  if (!user || user.deletedAt) {
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

async function updateUser(data: UpdateUserDTO) {
  const user = await userRepository.findById(data.id);

  if (!user) {
    throw new NotFoundError("User", data.id);
  }

  const hashedPassword = await hashingPassword(data.currentPassword);

  if (!(await bcrypt.compare(data.currentPassword, user.password))) {
    throw new UnauthError();
  }

  const update = await userRepository.updateData(data);

  return new UserResDTO(update);
}

async function deletedUser(id: string) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError("User", id);
  }

  return await userRepository.deletedUser(id);
}

async function getFavoriteStore(userId: string) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new NotFoundError("User", userId);
  }

  const favorite = await userRepository.getFavorite(userId);
  const store = favorite.map((fav) => new StoreResDTO(fav.store));

  return store.map((store) => new FavoriteResDTO(userId, store));
}

export default {
  getUser,
  getById,
  getByEmail,
  createUser,
  getMydata,
  updateUser,
  deletedUser,
  getFavoriteStore,
};
