import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

async function createwithStocks(
  tx: Prisma.TransactionClient,
  data: Prisma.ProductCreateInput
) {
  return await tx.product.create({
    data: data,
    include: {
      category: true,
      store: true,
      stocks: true,
      reviews: true,
      inquiries: true,
    },
  });
}

async function findProductById(productId: string) {
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      store: true,
      stocks: true,
      reviews: true,
      inquiries: true,
    },
  });
}

async function findAllProducts(params: Prisma.ProductFindManyArgs) {
  return await prisma.product.findMany(params);
}

async function findAllProductCount(where: Prisma.ProductWhereInput) {
  return await prisma.product.count({ where });
}

async function updateProductWithStocks(
  tx: Prisma.TransactionClient,
  data: Prisma.ProductUpdateInput,
  productId: string
) {
  return await tx.product.update({
    where: { id: productId },
    data: data,
    include: {
      category: true,
      store: true,
      stocks: true,
      reviews: true,
      inquiries: true,
    },
  });
}

async function update(data: Prisma.ProductUpdateInput, productId: string) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: data,
  });
}

async function deleteById(productId: string) {
  return await prisma.product.delete({
    where: { id: productId },
  });
}

export default {
  createwithStocks,
  findProductById,
  findAllProducts,
  findAllProductCount,
  updateProductWithStocks,
  update,
  deleteById,
};
