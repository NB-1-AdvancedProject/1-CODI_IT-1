import prisma from "../src/lib/prisma";
import { GradeMocks, CategoryMocks, SizeMocks } from "./mockDeploy";

async function main() {
  await Promise.all(
    SizeMocks.map(async (mock) => {
      await prisma.size.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    GradeMocks.map(async (mock) => {
      await prisma.grade.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    CategoryMocks.map(async (mock) => {
      await prisma.category.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
