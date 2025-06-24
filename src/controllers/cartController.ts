import { RequestHandler } from "express";
import { postCart, cartItemList, patchCart } from "../services/cartService";
import { cartDTO, cartListDTO, cartItemDTO } from "../lib/dto/cartDto";
import { create } from "superstruct";
import { addToCartBodyStuct } from "../structs/cartStructs";

export const postCartData: RequestHandler = async (req, res) => {
  const user = req.user!.id;

  const result: cartDTO = await postCart(user);

  res.status(201).json(result);
};

export const getCartItemList: RequestHandler = async (req, res) => {
  const user = req.user!.id;

  const result: cartListDTO = await cartItemList(user);

  res.status(200).json(result);
};

export const patchCartData: RequestHandler = async (req, res) => {
  const user = req.user!.id;
  const cart = create(req.body, addToCartBodyStuct);

  const result: cartItemDTO = await patchCart(user, cart);

  res.status(200).json(result);
};
