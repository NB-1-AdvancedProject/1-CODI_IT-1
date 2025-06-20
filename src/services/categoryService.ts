import categoryRepository from "../repositories/categoryRepository";

export async function getCategoryByName(categoryId: string) {
  return await categoryRepository.findCategoryByName(categoryId);
}

export default {
  getCategoryByName,
};
