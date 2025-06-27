import prisma from "../lib/prisma";

export async function findUserNotifications(userId: string) {
  return prisma.alarm.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function listData(userId: string) {
  return prisma.alarm.findMany({
    where: { userId: userId },
  });
}

export async function patchData(userId: string, alarmId: string) {
  return prisma.alarm.update({
    where: { id: alarmId, userId: userId },
    data: {
      isChecked: true,
    },
  });
}

export async function createAlarmData(userId: string, content: string) {
  return prisma.alarm.create({
    data: {
      userId: userId,
      content: content,
    },
  });
}

export async function findAlarmData(alarmId: string) {
  return prisma.alarm.findUnique({
    where: { id: alarmId },
  });
}

export async function createManyAlarm(
  productUserId: string,
  orderUserId: string,
  cartUserId: string,
  content: string
) {
  return prisma.alarm.createMany({
    data: [
      {
        userId: productUserId,
        content: content,
      },
      {
        userId: orderUserId,
        content: content,
      },
      {
        userId: cartUserId,
        content: content,
      },
    ],
  });
}
