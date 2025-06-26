import { RequestHandler } from "express";
import metadataService from "../services/metadataService";

export const getSizes: RequestHandler = async (req, res) => {
  const sizes = await metadataService.getSizes();
  res.send(sizes);
};

export const getCategory: RequestHandler = async (req, res) => {
  const category = await metadataService.getCategory(req.params.name);
  res.send([category]);
};

export const getGrades: RequestHandler = async (req, res) => {
  const grades = await metadataService.getGrades();
  res.send(grades);
};
