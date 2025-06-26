import prisma from "../lib/prisma";

async function findSizes() {
  return await prisma.size.findMany();
}

async function findCategoryByName(name: string) {
  return await prisma.category.findUnique({
    where: {
      name: name,
    },
  });
}

async function findGrades() {
  return await prisma.grade.findMany();
}

export default {
  findSizes,
  findCategoryByName,
  findGrades,
};
