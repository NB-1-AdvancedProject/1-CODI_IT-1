import { asyncHandler } from "../middleware/asyncHandler";
import { authMiddleware } from "../middleware/authMiddleware";
import express from "express";
import {
  notificationSSE,
  getNotificationList,
  patchNotificationData,
} from "../controllers/notificationController";

const notificationRouter = express.Router();

notificationRouter.get("/sse", authMiddleware, asyncHandler(notificationSSE));
notificationRouter.get("/", authMiddleware, asyncHandler(getNotificationList));
notificationRouter.patch(
  "/:id/check",
  authMiddleware,
  asyncHandler(patchNotificationData)
);

export default notificationRouter;
