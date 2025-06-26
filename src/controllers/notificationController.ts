import { RequestHandler } from "express";
import {
  getNotifications,
  notificationList,
  patchNotification,
} from "../services/notificationService";
import { IdParamsStruct } from "../structs/commonStructs";
import { create } from "superstruct";

const isTestEnv = process.env.NODE_ENV !== "production";

export const notificationSSE: RequestHandler = async (req, res) => {
  const userId = req.user!.id;

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendNotification = async () => {
    const notifications = await getNotifications(userId);
    res.write(`data: ${JSON.stringify(notifications)}\n\n`);
  };
  await sendNotification();

  if (isTestEnv) {
    res.end();
    return;
  }
  const intervalId = setInterval(() => {
    sendNotification();
  }, 30000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
};

export const getNotificationList: RequestHandler = async (req, res) => {
  const userId = req.user!.id;

  const result = await notificationList(userId);

  res.status(200).json(result);
};

export const patchNotificationData: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const { id: alarmId } = create(req.params, IdParamsStruct);

  await patchNotification(userId, alarmId);

  res.status(200).send();
};
