import { PaymentStatus, Prisma } from "@prisma/client";
import {
  CreateOrderData,
  CreateOrderItemDTO,
  StockDTO,
} from "../lib/dto/orderDTO";
import prisma from "../lib/prisma";
import { Token } from "../types/user";
import { OrderStatusType } from "../types/order";
import { string } from "superstruct";

async function orderSave(
  tx: Prisma.TransactionClient,
  user: Token,
  order: CreateOrderData
) {
  const createOrder = await tx.order.create({
    data: {
      userId: user.id,
      name: order.name,
      phone: order.phone,
      address: order.address,
      status: "PAID" as OrderStatusType,
      subtotal: order.subtotal,
      orderItems: {
        create: order.orderItems.map((item: CreateOrderItemDTO) => ({
          product: { connect: { id: item.productId } },
          size: { connect: { id: item.sizeId } },
          quantity: item.quantity,
          price: item.price,
        })),
      },
      usePoint: order.usePoint,
      payment: {
        create: {
          status: "CompletedPayment" as PaymentStatus,
          totalPrice: order.payment.totalPrice,
        },
      },
      paidAt: new Date(),
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              store: true,
              stocks: { include: { size: true } },
            },
          },
          size: true,
        },
      },
      payment: true,
    },
  });
  return createOrder;
}

async function getProductById(productId: string) {
  return await prisma.product.findUnique({ where: { id: productId } });
}

async function getStock(tx: Prisma.TransactionClient, item: StockDTO) {
  return await tx.stock.findFirst({
    where: {
      productId: item.productId,
      sizeId: item.sizeId,
    },
  });
}

async function getOrderList(
  user: Token,
  page: number,
  limit: number,
  orderBy: string,
  status?: OrderStatusType
) {
  const order = orderBy === "recent" ? "asc" : "desc";
  const where = status ? { userId: user.id, status } : { userId: user.id };

  return await prisma.order.findMany({
    where,
    orderBy: { createdAt: order },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              store: true,
              stocks: { include: { size: true } },
            },
          },
          size: true,
        },
      },
      payment: true,
    },
  });
}

async function getOrder(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              store: true,
              stocks: { include: { size: true } },
            },
          },
          size: true,
        },
      },
      payment: true,
    },
  });
}

async function deleteOrder(id: string) {
  return await prisma.order.delete({
    where: { id },
  });
}

export default {
  orderSave,
  getProductById,
  getOrderList,
  getOrder,
  getStock,
  deleteOrder,
};
