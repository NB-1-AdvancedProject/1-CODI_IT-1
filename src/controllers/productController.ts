import { RequestHandler } from "express";
import { create } from "superstruct";
import { CreateProductBodyStruct } from "../structs/productStructs";
import productService from "../services/productService";

export const postProduct: RequestHandler = async (req, res) => {
  console.log("postProduct", req.body);
  const data = create(req.body, CreateProductBodyStruct);
  console.log("validated data", data);
  const product = await productService.createProduct(data, req.user.id);
  console.log("created product", product);
  res.status(201).json(product);
};
