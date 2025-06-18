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
