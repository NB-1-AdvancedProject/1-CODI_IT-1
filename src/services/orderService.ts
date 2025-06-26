import { CreateOrderDTO, OrderResDTO } from "../lib/dto/orderDTO";
import CommonError from "../lib/errors/CommonError";
import NotFoundError from "../lib/errors/NotFoundError";
import prisma from "../lib/prisma";

import { OrderStatusType } from "../types/order";
import { Token } from "../types/user";
import userRepository from "../repositories/userRepository";
import productService from "./productService";
import { Decimal } from "@prisma/client/runtime/library";

async function findOrderItems(data: CreateOrderDTO) {
  let subtotal = new Decimal(0);
  const products = await Promise.all(
    data.orderItems.map(async (item) => {
      const product = await orderRepository.getProductById(item.productId);
      if (!product) {
        throw new NotFoundError("product", item.productId);
      }

      const updatedProduct = await productService.checkAndUpdateDiscountState(
        product.discountEndTime,
        product.id
      );

      const finalProduct = updatedProduct || product;
      const unitPrice = new Decimal(
        finalProduct.discountPrice ?? finalProduct.price
      );

      subtotal = subtotal.add(unitPrice.mul(item.quantity));

      return {
        finalProduct,
        unitPrice,
        quantity: item.quantity,
        sizeId: item.sizeId,
      };
    })
  );

  return { items: products, subtotal };
}

async function create(user: Token, data: CreateOrderDTO) {
  const orderItemInfo = await findOrderItems(data);

  const currentUser = await userRepository.findById(user.id);
  if (!currentUser) {
    throw new NotFoundError("User", user.id);
  }

  const order = await prisma.$transaction(async (tx) => {
    const newPoint = currentUser.point - data.usePoint;

    if (newPoint < 0) {
      throw new CommonError("포인트가 부족합니다.", 400);
    }

    const updateUser = await tx.user.update({
      where: { id: user.id },
      data: {
        point: newPoint,
      },
    });
    console.log(`${updateUser.id}의 잔여 포인트는 ${updateUser.point}입니다.`);

    for (const item of data.orderItems) {
      const stockToUpdate = await orderRepository.getStock(tx, item);

      if (!stockToUpdate) {
        throw new NotFoundError(
          "stock",
          `productId: ${item.productId}, sizeId: ${item.sizeId}`
        );
      }

      if (stockToUpdate.quantity < item.quantity) {
        throw new CommonError("재고가 부족합니다.", 400);
      }

      const newStockQuantity = stockToUpdate.quantity - item.quantity;
      if (newStockQuantity < 0) {
        throw new CommonError("재고가 부족 합니다.", 400);
      }

      const updateStock = await tx.stock.update({
        where: { id: stockToUpdate.id },
        data: { quantity: newStockQuantity },
      });

      console.log(
        `${updateStock.id}의 잔여 수량은 ${updateStock.quantity}입니다.`
      );
    }

    const orderItems = {
      ...data,
      subtotal: new Decimal(orderItemInfo.subtotal),
      orderItems: orderItemInfo.items.map((item) => ({
        productId: item.finalProduct.id,
        sizeId: item.sizeId,
        quantity: item.quantity,
        price: new Decimal(item.unitPrice),
      })),
      payment: {
        totalPrice: orderItemInfo.subtotal.sub(data.usePoint),
      },
    };

    const createOrder = await orderRepository.orderSave(tx, user, orderItems);

    return createOrder;
  });

  const fullOrderData = {
    ...order,
    totalQuantity: data.orderItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    ),
    orderItems: order.orderItems,
    payment: order.payment,
  };

  return new OrderResDTO(fullOrderData);
}

async function getOrderList(
  user: Token,
  page: number,
  limit: number,
  orderBy: string,
  status?: OrderStatusType
) {
  const orderList = await orderRepository.getOrder(
    user,
    page,
    limit,
    orderBy,
    status
  );

  const orderResList = orderList.map(
    (order) =>
      new OrderResDTO({
        ...order,
        totalQuantity: order.orderItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        ),
        orderItems: order.orderItems,
        payment: order.payment,
      })
  );

  return orderResList;
}

export default {
  create,
  getOrderList,
};
