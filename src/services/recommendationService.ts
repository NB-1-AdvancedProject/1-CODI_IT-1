import {
  RecommendationDTO,
  RecommendationItem,
  RecommendationValue,
} from "../lib/dto/recommendationDTO";
import NotFoundError from "../lib/errors/NotFoundError";
import productRepository from "../repositories/productRepository";
import * as recommendationRepository from "../repositories/recommendationRepository";

export async function getRecommendation(
  productId: string
): Promise<RecommendationDTO> {
  const existingProduct = await productRepository.findProductById(productId);
  if (!existingProduct) {
    throw new NotFoundError("Product", productId);
  }
  const recommendations = await recommendationRepository.getRedisByKey(
    `item:recommendation:${productId}`
  );
  if (!recommendations) {
    throw new NotFoundError("Recommendation", `productId: ${productId}`);
  }
  const parsedData: RecommendationValue = JSON.parse(recommendations);
  let recommendationIds: string[] = [];
  if (parsedData && Array.isArray(parsedData.items)) {
    recommendationIds = parsedData.items.map((item) => item.id);
  }
  const productsWithResult = await Promise.allSettled(
    recommendationIds.map((id) =>
      recommendationRepository.findProductForRecommendation(id)
    )
  );
  const products = productsWithResult
    .filter((product) => product.status === "fulfilled")
    .map((result) => result.value)
    .slice(0, 5);
  return new RecommendationDTO(productId, products);
}
