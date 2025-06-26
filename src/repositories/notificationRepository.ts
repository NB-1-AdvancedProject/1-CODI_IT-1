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
      content: "문의가 등록되었습니다.",
    },
  });
}

export async function findAlarmData(alarmId: string) {
  return prisma.alarm.findUnique({
    where: { id: alarmId },
  });
}
