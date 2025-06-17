import productRepository from "../repositories/productRepository";

async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  categoryId: string;
}) {
  const { name, description, price, categoryId } = data;

  if (!name || !description || !price || !categoryId) {
    throw new Error("All fields are required");
  }

  if (typeof price !== "number" || price <= 0) {
    throw new Error("Price must be a positive number");
  }

  const product = await productRepository.create({
    name,
    description,
    price,
    categoryId,
  });

  return product;
}
