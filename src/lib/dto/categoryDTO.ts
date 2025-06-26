import { Category } from "@prisma/client";

export class CategoryDTO {
  name: string;
  id: string;
  constructor(category: Category) {
    this.name = category.name;
    this.id = category.id;
  }
}
