import { RequestHandler } from "express";
import * as dashboardService from "../services/dashboardService";

export const getDashboard: RequestHandler = async (req, res) => {
  const { id: userId, type: userType } = req.user!;
  const result = await dashboardService.getDashboard({ userId, userType });
  console.log(`dashboard: `, result);
  console.log(
    "topSales[0].product",
    JSON.stringify(result.topSales?.[0]?.products, null, 2)
  );
  res.status(200).json(result);
};
