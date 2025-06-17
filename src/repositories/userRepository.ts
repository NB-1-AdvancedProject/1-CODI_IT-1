import NotFoundError from "../lib/errors/NotFoundError";
import prisma from "../lib/prisma";

async function getById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundError("user", id);
  }

  return;
}

export default{ getById };
