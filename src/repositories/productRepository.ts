import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

async function create(data: Prisma.ProductCreateInput) {
  return await prisma.product.create({
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

async function deleteById(productId: string) {
  return await prisma.product.delete({
    where: { id: productId },
  });
}

export default {
  create,
  findProductById,
  deleteById,
};
