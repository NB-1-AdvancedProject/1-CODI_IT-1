import express from "express";
import {
  getSizes,
  getCategory,
  getGrades,
} from "../controllers/metadataController";
import { asyncHandler } from "../middleware/asyncHandler";

export const metadataRouter = express.Router();

metadataRouter.get("/size", asyncHandler(getSizes));
metadataRouter.get("/category/:name", asyncHandler(getCategory));
metadataRouter.get("/grade", asyncHandler(getGrades));
