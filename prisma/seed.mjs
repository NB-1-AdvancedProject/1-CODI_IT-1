import { PrismaClient } from "@prisma/client";
import { USER } from "./mock.mjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: USER,
    skipDuplicates: true,
  });
  await prisma.$executeRawUnsafe(
    `SELECT setVal('"User_id_seq"', (SELECT MAX(id) FROM "User"));`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
