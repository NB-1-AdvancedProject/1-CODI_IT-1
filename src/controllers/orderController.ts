import { RequestHandler } from "express";
import orderService from "../services/orderService";
import { create } from "superstruct";
import { CreateOrder, GetOrder } from "../structs/orderStructs";

export const createOrder: RequestHandler = async (req, res) => {
  const user = req.user!;

  const data = create(req.body, CreateOrder);
  const order = await orderService.create(user, data);

  res.status(201).send(order);
};

export const getOrderList: RequestHandler = async (req, res) => {
  const user = req.user!;
  const {
    page = 1,
    limit = 3,
    orderBy = "recent",
    status,
  } = create(req.query, GetOrder);

  const orderList = await orderService.getOrderList(
    user,
    page,
    limit,
    orderBy,
    status
  );

  res.status(200).send(orderList);
};
