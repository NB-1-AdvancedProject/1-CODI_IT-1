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

export default {
  create,
};
