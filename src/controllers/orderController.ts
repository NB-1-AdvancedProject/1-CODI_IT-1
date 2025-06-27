import { RequestHandler } from "express";
import orderService from "../services/orderService";
import { create } from "superstruct";
import { CreateOrder, GetOrder, UpdateOrder } from "../structs/orderStructs";
import { IdParamsStruct } from "../structs/commonStructs";

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

export const getOrderDetail: RequestHandler = async (req, res) => {
  const user = req.user!;
  const { id: orderId } = create(req.params, IdParamsStruct);

  const order = await orderService.getOrder(user, orderId);

  res.status(200).send(order);
};

export const deleteOrder: RequestHandler = async (req, res) => {
  const user = req.user!;
  const { id: orderId } = create(req.params, IdParamsStruct);

  await orderService.deleteOrder(user, orderId);

  res.status(201).send({ message: "요청하신 주문이 삭제하였습니다." });
};

export const patchOrder: RequestHandler = async (req, res) => {
  const user = req.user!;
  const { id: orderId } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateOrder);

  const order = await orderService.updateOrder(user, orderId, data);

  res.status(201).send(order);
};
