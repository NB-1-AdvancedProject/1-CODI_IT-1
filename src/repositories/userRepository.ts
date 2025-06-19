import { CreateUserDTO } from "../lib/dto/userDTO";
import prisma from "../lib/prisma";

async function findById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
}

async function findByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}

async function save(data: CreateUserDTO) {
  const grade = await prisma.grade.upsert({
    where: { id: "grade_green" },
    update: {},
    create: {
      id: "grade_green",
      name: "green",
      pointRate: 2,
      minAmount: 100000,
    },
  });

  return await prisma.user.create({
    data: {
      ...data,
      gradeId: grade.id,
    },
    include: { grade: true },
  });
}

async function getFavorite(id: string) {
  return await prisma.favoriteStore.findMany({
    where: { userId: id },
    select: {
      store: true,
    },
  });
}

export default { findById, findByEmail, save, getFavorite };
