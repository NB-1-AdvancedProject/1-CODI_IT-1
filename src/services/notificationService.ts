import {
  findUserNotifications,
  listData,
  patchData,
  findAlarmData,
} from "../repositories/notificationRepository";
import { AlarmDTO } from "../lib/dto/notificationDto";
import NotFoundError from "../lib/errors/NotFoundError";
import userRepository from "../repositories/userRepository";
import ForbiddenError from "../lib/errors/ForbiddenError";

export async function getNotifications(userId: string) {
  const notifications = await findUserNotifications(userId);
  return notifications.map((notification) => new AlarmDTO(notification));
}

export async function notificationList(userId: string) {
  const userData = await userRepository.findById(userId);

  if (!userData) {
    throw new NotFoundError("User", userId);
  }

  const notifications = await listData(userId);

  return notifications.map((notifiaction) => new AlarmDTO(notifiaction));
}

export async function patchNotification(userId: string, alarmId: string) {
  const userData = await userRepository.findById(userId);

  if (!userData) {
    throw new NotFoundError("User", userId);
  }

  const alarm = await findAlarmData(alarmId);

  if (userData.id !== alarm?.userId) {
    throw new ForbiddenError();
  }

  await patchData(userId, alarmId);
}
