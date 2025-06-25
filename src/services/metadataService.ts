import { CategoryDTO } from "../lib/dto/categoryDTO";
import { GradeDTO } from "../lib/dto/gradeDTO";
import { SizeDTO } from "../lib/dto/SizeDTO";
import NotFoundError from "../lib/errors/NotFoundError";
import metadataRepository from "../repositories/metadataRepository";

async function getSizes() {
  const sizes = await metadataRepository.findSizes();
  return sizes.map((size) => new SizeDTO(size));
}

async function getCategory(name: string) {
  const category = await metadataRepository.findCategoryByName(name);
  if (!category) throw new NotFoundError("category", name);
  return new CategoryDTO(category);
}

async function getGrades() {
  const grades = await metadataRepository.findGrades();
  return grades.map((grade) => new GradeDTO(grade));
}

export default {
  getSizes,
  getCategory,
  getGrades,
};
