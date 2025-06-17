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


export default { findById, findByEmail };
