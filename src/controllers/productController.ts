import { RequestHandler } from "express";
import { create } from "superstruct";
import {
  CreateProductBodyStruct,
  PatchProductBodyStruct,
  ProductListParamsStruct,
} from "../structs/productStructs";
import productService from "../services/productService";
import UnauthError from "../lib/errors/UnauthError";
import NotFoundError from "../lib/errors/NotFoundError";

export const getProduct: RequestHandler = async (req, res) => {
  const product = await productService.getProduct(req.params.id);
  if (!product) throw new NotFoundError("product", req.params.id);
  res.json(product);
};

export const getProducts: RequestHandler = async (req, res) => {
  const params = create(req.query, ProductListParamsStruct);
  const products = await productService.getProducts(params);
  res.json(products);
};

export const postProduct: RequestHandler = async (req, res) => {
  const data = create(req.body, CreateProductBodyStruct);
  const product = await productService.createProduct(data, req.user!.id);
  res.status(201).json(product);
};

export const patchProduct: RequestHandler = async (req, res) => {
  const productId = req.params.id;
  const sellerId = await productService.getSellerIdByProductId(productId);
  if (sellerId != req.user!.id) {
    throw new UnauthError();
  }

  const data = create(req.body, PatchProductBodyStruct);
  const product = await productService.updateProduct(data, productId);
  console.log("product", product);
  res.json(product);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const productId = req.params.id;
  await productService.deleteProduct(productId, req.user!.id);
  res.status(204).send();
};
