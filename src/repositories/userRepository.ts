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
  return await prisma.user.create({
    data,
  });
}

export default { findById, findByEmail, save };
