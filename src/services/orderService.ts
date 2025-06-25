import { CreateOrderDTO, OrderResDTO } from "../lib/dto/orderDTO";
import CommonError from "../lib/errors/CommonError";
import NotFoundError from "../lib/errors/NotFoundError";
import prisma from "../lib/prisma";
import orderRepository from "../repositories/orderRepository";
import { OrderStatusType } from "../types/order";
import { Token } from "../types/user";
import userRepository from "../repositories/userRepository";

async function create(user: Token, data: CreateOrderDTO) {
  const products = await Promise.all(
    data.orderItems.map((item) =>
      orderRepository.getProductById(item.productId)
    )
  );

  const notFoundProductIds = data.orderItems
    .map((item, idx) => (!products[idx] ? item.productId : null))
    .filter((id): id is string => id !== null);

  if (notFoundProductIds.length > 0) {
    notFoundProductIds.forEach((id) => {
      throw new NotFoundError("product", id);
    });
  }

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

      const newStockQuamtity = stockToUpdate.quantity - item.quantity;
      if (newStockQuamtity < 0) {
        throw new CommonError("재고가 부족 합니다.", 400);
      }

      const updateStock = await tx.stock.update({
        where: { id: stockToUpdate.id },
        data: { quantity: newStockQuamtity },
      });

      console.log(
        `${updateStock.id}의 잔여 포인트는 ${updateStock.quantity}입니다.`
      );
    }

    const createOrder = await orderRepository.orderSave(tx, user, data);

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
  status: OrderStatusType,
  page: number,
  limit: number,
  orderBy: string
) {
  const orderList = await orderRepository.getOrder(
    user,
    status,
    page,
    limit,
    orderBy
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
