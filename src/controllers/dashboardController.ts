import { RequestHandler } from "express";
import * as dashboardService from "../services/dashboardService";

export const getDashboard: RequestHandler = async (req, res) => {
  const { id: userId, type: userType } = req.user!;
  const result = await dashboardService.getDashboard({ userId, userType });
  res.status(200).json(result);
};
