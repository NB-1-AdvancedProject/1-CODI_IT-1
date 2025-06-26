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

// function parseRequestBody(rawBody: any) {
//   return {
//     name: rawBody.name,
//     price: rawBody.price !== undefined ? Number(rawBody.price) : undefined,
//     content: rawBody.content,
//     image: rawBody.image,
//     discountRate:
//       rawBody.discountRate !== undefined
//         ? Number(rawBody.discountRate)
//         : undefined,
//     discountStartTime: rawBody.discountStartTime
//       ? new Date(rawBody.discountStartTime)
//       : undefined,
//     discountEndTime: rawBody.discountEndTime
//       ? new Date(rawBody.discountEndTime)
//       : undefined,
//     categoryName: rawBody.categoryName,
//     stocks: Array.isArray(rawBody.stocks)
//       ? rawBody.stocks.map((stock: any) => ({
//           sizeId: stock.sizeId,
//           quantity: Number(stock.quantity),
//         }))
//       : [],
//     isSoldOut: rawBody.isSoldOut,
//   };
// }
// function parseProductListParams(rawQuery: any) {
//   return {
//     page: rawQuery.page ? parseInt(rawQuery.page, 10) : 1,
//     pageSize: rawQuery.pageSize ? parseInt(rawQuery.pageSize, 10) : 16,
//     search: rawQuery.search ?? undefined,
//     searchBy: rawQuery.searchBy ?? undefined,
//     sort: rawQuery.sort ?? undefined,
//     priceMin:
//       rawQuery.priceMin !== undefined
//         ? isNaN(Number(rawQuery.priceMin))
//           ? undefined
//           : Number(rawQuery.priceMin)
//         : undefined,
//     priceMax:
//       rawQuery.priceMax !== undefined
//         ? isNaN(Number(rawQuery.priceMax))
//           ? undefined
//           : Number(rawQuery.priceMax)
//         : undefined,
//     favoriteStore: rawQuery.favoriteStore ?? undefined,
//     size: rawQuery.size ?? undefined,
//     categoryName: rawQuery.categoryName ?? undefined,
//   };
// }

export const getProduct: RequestHandler = async (req, res) => {
  console.log("yes");
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
  console.log("yesyes");
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
