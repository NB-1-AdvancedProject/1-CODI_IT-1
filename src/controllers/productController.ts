import { RequestHandler } from "express";
import { create } from "superstruct";
import { CreateProductBodyStruct } from "../structs/productStructs";
import productService from "../services/productService";

export const postProduct: RequestHandler = async (req, res) => {
  const data = create(req.body, CreateProductBodyStruct);
  const product = await productService.createProduct(data, req.user.id);
  res.status(201).json(product);
};
