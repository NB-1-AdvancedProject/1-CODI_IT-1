import { DetailProductResponseDTO } from "../lib/dto/productDTO";
import { StocksReponseDTO } from "../lib/dto/stockDTO";
import NotFoundError from "../lib/errors/NotFoundError";
import productRepository from "../repositories/productRepository";
import { CreateProductBody } from "../structs/productStructs";
import * as storeService from "../services/storeService";
import stockService from "./stockService";

async function createProduct(data: CreateProductBody, userId: string) {
  const store = await storeService.getStoreByUserId(userId);
  if (!store) {
    throw new NotFoundError("Store", userId);
  }
  console.log("data", data);
  const newData = {
    name: data.name,
    price: data.price,
    content: data.content,
    image: data.image,
    discountRate: data.discountRate || 0,
    discountStartTime: data.discountStartTime || null,
    discountEndTime: data.discountEndTime || null,
    category: {
      connectOrCreate: {
        where: { name: data.categoryName },
        create: { name: data.categoryName },
      },
    },
    store: { connect: { id: store.id } },
  };
  console.log("newData", newData);
  const product = await productRepository.create(newData);
  console.log("product", product);
  const stocks = await stockService.createStocks(data.stocks, product.id);
  console.log("stocks", stocks);
  return {
    ...product, //밑에있는 모든게 DetailedProductResponseDTO 로 처리필요
    storeId: product.store.id,
    storeName: product.store.name,
    reviewsRating:
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      (product.reviews.length || 1),
    reviewsCount: product.reviews.length,
    reviews: product.reviews,
    inquiries: product.inquiries,
    discountPrice:
      Number(product.discountRate || 0) > 0
        ? Number(product.price) * (1 - Number(product.discountRate || 0) / 100)
        : Number(product.price),
    discountRate: product.discountRate || 0,
    discountStartTime: product.discountStartTime
      ? product.discountStartTime.toISOString()
      : null,
    discountEndTime: product.discountEndTime
      ? product.discountEndTime.toISOString()
      : null,
    stocks: new StocksReponseDTO(stocks).stocks,
    category: [{ name: product.category.name, id: product.category.id }],
  };
}

export default {
  createProduct,
};
