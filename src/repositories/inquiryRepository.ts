import { InquiryStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import { inquiryType, updateInquiryType } from "../structs/inquiryStructs";

export async function listData(params: inquiryType, userId: string) {
  return prisma.inquiry.findMany({
    where: {
      userId,
      ...(params.status && { status: params.status as InquiryStatus }),
    },
    skip: (params.page - 1) * params.pageSize,
    take: params.pageSize,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          image: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function countData(userId: string) {
  return prisma.inquiry.count({
    where: {
      userId,
    },
  });
}

export async function patchData(param: string, inquiry: updateInquiryType) {
  return prisma.inquiry.update({
    where: { id: param },
    data: {
      ...inquiry,
    },
  });
}

export async function getData(param: string) {
  return prisma.inquiry.findUnique({
    where: { id: param },
  });
}

export async function delInquiry(inquiryId: string) {
  return prisma.inquiry.delete({
    where: { id: inquiryId },
  });
}

export async function createReply(user: string, params: string, reply: string) {
  return prisma.reply.create({
    data: {
      inquiryId: params,
      userId: user,
      content: reply,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getReplyData(params: string) {
  return prisma.reply.findUnique({
    where: { id: params },
  });
}

export async function patchReplay(params: string, reply: string) {
  return prisma.reply.update({
    where: { id: params },
    data: {
      content: reply,
    },
    include: {
      user: true,
    },
  });
}

export async function inquiryDetail(params: string) {
  return prisma.inquiry.findUnique({
    where: { id: params },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      Reply: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}
