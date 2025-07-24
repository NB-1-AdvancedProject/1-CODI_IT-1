import prisma from "./prisma";

export interface GradeMock {
  id: string;
  name: string;
  pointRate: number;
  minAmount: number;
}

export interface CategoryMock {
  id: string;
  name: string;
  description: string;
}

export interface SizeMock {
  id: number;
  size: string;
}

export const GradeMocks: GradeMock[] = [
  {
    id: "grade_vip",
    name: "VIP",
    pointRate: 10,
    minAmount: 1000000,
  },
  {
    id: "grade_black",
    name: "BLACK",
    pointRate: 7,
    minAmount: 500000,
  },
  {
    id: "grade_red",
    name: "RED",
    pointRate: 5,
    minAmount: 300000,
  },
  {
    id: "grade_orange",
    name: "Orange",
    pointRate: 3,
    minAmount: 100000,
  },
  {
    id: "grade_green",
    name: "Green",
    pointRate: 1,
    minAmount: 0,
  },
];

export const CategoryMocks: CategoryMock[] = [
  {
    id: "cy7ho4p9r0dj2itnpgwkyqg1s",
    name: "TOP",
    description: "Security mission reveal through business.",
  },
  {
    id: "c0fm6puffcuhepnyi73xibhcr",
    name: "BOTTOM",
    description: "Bank increase head nature good center perform.",
  },
  {
    id: "csev4ctimhvcocsts64xd4lym",
    name: "DRESS",
    description: "Identify run guess pattern.",
  },
];

export const SizeMocks: SizeMock[] = [
  {
    id: 1,
    size: "Free",
  },
  {
    id: 2,
    size: "XS",
  },
  {
    id: 3,
    size: "S",
  },
  {
    id: 4,
    size: "M",
  },
  {
    id: 5,
    size: "L",
  },
  {
    id: 6,
    size: "XL",
  },
];

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
