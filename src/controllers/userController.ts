import { RequestHandler } from "express";
import { create } from "superstruct";
import { CreateUser } from "../structs/userStructs";
import userService from "../services/userService";

export const createUser: RequestHandler = async (req, res) => {
  const data = create(req.body, CreateUser);
  const user = await userService.createUser(data);
  res.status(201).send(user);
};
