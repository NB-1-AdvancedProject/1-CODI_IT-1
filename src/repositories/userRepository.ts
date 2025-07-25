import { Prisma } from "@prisma/client";
import { CreateUserDTO, UpdateUserDTO } from "../lib/dto/userDTO";
import prisma from "../lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

async function findById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { grade: true },
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
      pointRate: 1,
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

async function updateData(data: UpdateUserDTO) {
  return await prisma.user.update({
    where: { id: data.id },
    data: {
      name: data.name,
      password: data.password,
      image: data.image,
    },
    include: { grade: true },
  });
}

async function deletedUser(id: string) {
  return await prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
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

async function updateGrade(
  tx: Prisma.TransactionClient,
  id: string,
  currentPoint: number,
  totalAmount: Decimal,
  gradeId: string
) {
  return await tx.user.update({
    where: { id },
    data: {
      point: currentPoint,
      totalAmount,
      gradeId,
    },
  });
}

export default {
  findById,
  findByEmail,
  save,
  updateData,
  deletedUser,
  getFavorite,
  updateGrade,
};
