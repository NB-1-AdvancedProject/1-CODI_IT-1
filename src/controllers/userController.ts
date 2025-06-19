import { RequestHandler } from "express";
import { create } from "superstruct";
import { CreateUser } from "../structs/userStructs";
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

export const getLikeStore: RequestHandler = async (req, res) => {
  const userId = req.user.id;

  const likeStore = await userService.getFavoriteStore(userId);

  res.status(200).send(likeStore);
};
