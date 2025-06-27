import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../src/lib/prisma";
import { Grade } from "../src/types/user";

type GradeInput = Omit<Grade, "createdAt" | "updatedAt">;

export async function createGrade(data: GradeInput[]) {
  return await Promise.all(
    data.map((grade) => prisma.grade.create({ data: grade }))
  );
}

export const grade = [
  {
    id: "grade_vip",
    name: "VIP",
    pointRate: 10,
    minAmount: new Decimal(1000000),
  },
  {
    id: "grade_black",
    name: "BLACK",
    pointRate: 7,
    minAmount: new Decimal(500000),
  },
  {
    id: "grade_red",
    name: "RED",
    pointRate: 5,
    minAmount: new Decimal(300000),
  },
  {
    id: "grade_orange",
    name: "Orange",
    pointRate: 3,
    minAmount: new Decimal(100000),
  },
  {
    id: "grade_green",
    name: "Green",
    pointRate: 1,
    minAmount: new Decimal(0),
  },
];
