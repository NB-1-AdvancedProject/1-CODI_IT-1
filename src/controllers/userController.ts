import { RequestHandler } from "express";
import { create } from "superstruct";
import { CreateUser, UpdateUser } from "../structs/userStructs";
import userService from "../services/userService";

export const createUser: RequestHandler = async (req, res) => {
  const data = create(req.body, CreateUser);
  const user = await userService.createUser(data);
  res.status(201).send(user);
};

export const getUser: RequestHandler = async (req, res) => {
  const userId = req.user!.id;

  const mypage = await userService.getMydata(userId);

  res.status(200).send(mypage);
};

export const patchUser: RequestHandler = async (req, res) => {
  const id = req.user!.id;
  const { currentPassword, ...data } = req.body;

  const updateData = create(data, UpdateUser);

  const updatedUser = await userService.updateUser({
    id,
    ...updateData,
    currentPassword,
  });

  res.status(200).send(updatedUser);
};

export const daleteUser: RequestHandler = async (req, res) => {
  const id = req.user!.id;

  await userService.deletedUser(id);

  res.status(200).send({ message: "회원 탈퇴 성공" });
};

export const getLikeStore: RequestHandler = async (req, res) => {
  const userId = req.user!.id;

  const likeStore = await userService.getFavoriteStore(userId);

  res.status(200).send(likeStore);
};
