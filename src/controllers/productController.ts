import { RequestHandler } from "express";

export const postProduct: RequestHandler = async (req, res) => {
  const { name, description, price, categoryId } = req.body;

  if (!name || !description || !price || !categoryId) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  if (typeof price !== "number" || price <= 0) {
    res.status(400).json({ error: "Price must be a positive number" });
    return;
  }

  res.status(201).json({ message: "Product created (dummy)" });
};
