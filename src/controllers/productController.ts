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
  const { url, key } = (req as any).uploadedImage || {};
  if (typeof req.body.stocks === "string") {
    req.body.stocks = JSON.parse(req.body.stocks);
  }
  const newStocks = req.body.stocks.map(
    (stock: { sizeId: number; quantity: number }) => {
      if (stock.sizeId === 1) {
        return { sizeId: "sizeXS_id", quantity: stock.quantity };
      }
      if (stock.sizeId === 2) {
        return { sizeId: "sizeS_id", quantity: stock.quantity };
      }
      if (stock.sizeId === 3) {
        return { sizeId: "sizeM_id", quantity: stock.quantity };
      }
      if (stock.sizeId === 4) {
        return { sizeId: "sizeL_id", quantity: stock.quantity };
      }
      if (stock.sizeId === 5) {
        return { sizeId: "sizeXL_id", quantity: stock.quantity };
      }
      if (stock.sizeId === 6) {
        return { sizeId: "sizefree_id", quantity: stock.quantity };
      }
    }
  );
  const data = create(
    { ...req.body, image: url, stocks: newStocks },
    CreateProductBodyStruct
  );
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
