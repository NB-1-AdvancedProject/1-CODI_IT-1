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
  const userId = req.user.id;

  const mypage = await userService.getMydata(userId);

  res.status(200).send(mypage);
};

export const patchUser: RequestHandler = async (req, res) => {
  const id = req.user.id;
  const { password, ...data } = req.body;

  const updateData = create(data, UpdateUser);

  const updatedUser = await userService.updateUser({
    id,
    ...updateData,
    password,
  });

  res.status(201).send(updatedUser);
};
