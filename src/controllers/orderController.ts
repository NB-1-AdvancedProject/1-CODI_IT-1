import { RequestHandler } from "express";
import userService from "../services/userService";
import orderService from "../services/orderService";
import { create } from "superstruct";
import { CreateOrder } from "../structs/orderStructs";

export const createOrder: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const user = await userService.getById(userId);

  const data = create(req.body, CreateOrder);
  const order = await orderService.create(user, data);

  res.status(201).send(order);
};
