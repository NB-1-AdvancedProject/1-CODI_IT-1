import prisma from "../lib/prisma";

async function findCategoryByName(categoryName: string) {
  return await prisma.category.findUnique({
    where: { id: categoryName },
  });
}

export default {
  findCategoryByName,
};
