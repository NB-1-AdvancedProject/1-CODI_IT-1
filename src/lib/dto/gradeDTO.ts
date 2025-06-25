import { Grade } from "@prisma/client";

export class GradeDTO {
  name: string;
  id: string;
  rate: number;
  minAmount: number;
  constructor(grade: Grade) {
    this.name = grade.name;
    this.id = grade.id;
    this.rate = grade.pointRate;
    this.minAmount = Number(grade.minAmount);
  }
}
