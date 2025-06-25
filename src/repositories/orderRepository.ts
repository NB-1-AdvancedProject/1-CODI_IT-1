import { PaymentStatus } from "@prisma/client";
import { CreateOrderItemDTO, StockDTO } from "../lib/dto/orderDTO";
import prisma from "../lib/prisma";
import { Token } from "../types/user";

async function orderSave(user: Token, order: any) {
  const createOrder = await prisma.order.create({
    data: {
      userId: user.id,
      name: order.name,
      phone: order.phone,
      address: order.address,
      status: order.status,
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
      paidAt: order.payment.status === "CompletedPayment" ? new Date() : null,
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

async function getStock(orderItems: StockDTO[]) {
  return await prisma.stock.findMany({
    where: {
      OR: orderItems.map((item) => ({
        productId: item.productId,
        sizeId: item.sizeId,
      })),
    },
  });
}

export default {
  orderSave,
  getProductById,
  getStock,
};
