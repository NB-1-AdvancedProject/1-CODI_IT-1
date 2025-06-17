import prisma from "../lib/prisma";

async function create(data: {
  name: string;
  description: string;
  price: number;
  categoryId: string;
}) {
  const { name, description, price, categoryId } = data;

  const product = await prisma.product.create({
    data: {
      name,
      content,
      price,
      discountRate,
      discountStartTime,
      discountEndTime,
    },
  });

  return product;
}

export default {
  create,
};
