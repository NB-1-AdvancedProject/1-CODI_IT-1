import { RequestHandler } from "express";
import { create } from "superstruct";
import { CreateProductBodyStruct } from "../structs/productStructs";
import productService from "../services/productService";

function parseRequestBody(rawBody: any) {
  return {
    name: rawBody.name,
    price: Number(rawBody.price),
    content: rawBody.content,
    image: rawBody.image,
    discountRate:
      rawBody.discountRate !== undefined
        ? Number(rawBody.discountRate)
        : undefined,
    discountStartTime: rawBody.discountStartTime
      ? new Date(rawBody.discountStartTime)
      : undefined,
    discountEndTime: rawBody.discountEndTime
      ? new Date(rawBody.discountEndTime)
      : undefined,
    categoryName: rawBody.categoryName,
    stocks: Array.isArray(rawBody.stocks)
      ? rawBody.stocks.map((stock: any) => ({
          sizeId: stock.sizeId,
          quantity: Number(stock.quantity),
        }))
      : [],
  };
}

export const postProduct: RequestHandler = async (req, res) => {
  const data = create(parseRequestBody(req.body), CreateProductBodyStruct);
  const product = await productService.createProduct(data, req.user.id);
  res.status(201).json(product);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const productId = req.params.id;
  await productService.deleteProduct(productId, req.user.id);
  res.status(204).send();
};
