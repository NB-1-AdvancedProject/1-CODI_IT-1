import {
  CreateOrderDTO,
  OrderListResDTO,
  OrderResDTO,
  UpdateOrderDTO,
} from "../lib/dto/orderDTO";
import CommonError from "../lib/errors/CommonError";
import NotFoundError from "../lib/errors/NotFoundError";
import prisma from "../lib/prisma";
import orderRepository from "../repositories/orderRepository";
import { OrderStatusType } from "../types/order";
import { Token } from "../types/user";
import userRepository from "../repositories/userRepository";
import productService from "./productService";
import { Decimal } from "@prisma/client/runtime/library";

import ForbiddenError from "../lib/errors/ForbiddenError";
import BadRequestError from "../lib/errors/BadRequestError";
import stockRepository from "../repositories/stockRepository";

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

async function calculateUserGrade(totalAmount: Decimal) {
  const gradeTiers = await orderRepository.getGrade();

  const sortedTiers = gradeTiers.sort(
    (a, b) =>
      new Decimal(b.minAmount).toNumber() - new Decimal(a.minAmount).toNumber()
  );

  for (const tier of sortedTiers) {
    if (totalAmount.gte(new Decimal(tier.minAmount))) {
      return tier.id;
    }
  }
  return "grade_green";
}

async function calculateExpectedPoint(user: Token, subtotal: Decimal) {
  if (!user.gradeId) return 0;

  const grade = await orderRepository.getByGradeId(user.gradeId);

  if (!grade || !grade.pointRate) return 0;

  const rate = new Decimal(grade?.pointRate).dividedBy(100);
  const expectedPoint = new Decimal(subtotal).times(rate);

  return expectedPoint.toDecimalPlaces(0).toNumber();
}

async function updateUserGrade(user: Token, subtotal: Decimal) {
  const totalAmount = new Decimal(user.totalAmount).plus(subtotal);
  const newGrade = await calculateUserGrade(totalAmount);

  return { totalAmount, newGrade };
}

async function create(user: Token, data: CreateOrderDTO) {
  const orderItemInfo = await findOrderItems(data);

  const currentUser = await userRepository.findById(user.id);
  if (!currentUser) {
    throw new NotFoundError("User", user.id);
  }

  const order = await prisma.$transaction(async (tx) => {
    if (currentUser.point < data.usePoint) {
      throw new CommonError("포인트가 부족합니다.", 400);
    }

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

      const updateStock = await stockRepository.updateStockTx(tx, {
        where: { id: stockToUpdate.id },
        data: { quantity: newStockQuantity },
      });

      const productSales = await orderRepository.productSales(
        tx,
        item.productId,
        item.quantity
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

    const currentPoint = currentUser.point - data.usePoint;

    if (currentPoint < 0) {
      throw new CommonError("포인트가 부족합니다.", 400);
    }

    const realPay = Decimal.max(orderItemInfo.subtotal.minus(data.usePoint), 0);

    const point = await calculateExpectedPoint(currentUser, realPay);

    const finalPoint = currentPoint + point;
    const grade = await updateUserGrade(currentUser, orderItemInfo.subtotal);

    const updateUser = await userRepository.updateGrade(
      tx,
      currentUser.id,
      finalPoint,
      grade.totalAmount,
      grade.newGrade
    );

    const createOrder = await orderRepository.orderSave(tx, user, orderItems);

    return createOrder;
  });

  const fullOrderData = {
    ...order,
    totalQuantity: data.orderItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    ),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      isReviewed: false,
    })),
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
  const data = await orderRepository.getOrderList(
    user,
    page,
    limit,
    orderBy,
    status
  );

  const orderResList = {
    data: data.orderList.map((order) => {
      const totalQuantity = order.orderItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      const orderItems = order.orderItems.map((item) => {
        const isReviewed = item.product.reviews.some(
          (review) => review.orderItemId === item.id
        );

        return {
          ...item,
          isReviewed,
        };
      });

      return new OrderListResDTO({
        ...order,
        totalQuantity,
        orderItems,
        payment: order.payment,
      });
    }),
    meta: {
      total: data.orderCount,
      page,
      limit,
      totalPages: Math.ceil(data.orderCount / limit),
    },
  };

  return orderResList;
}

async function getOrder(user: Token, id: string) {
  const order = await orderRepository.getOrder(id);
  if (!order) {
    throw new NotFoundError("order", id);
  }

  if (order.userId !== user.id) {
    throw new ForbiddenError();
  }

  return new OrderResDTO({
    ...order,
    totalQuantity: order.orderItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    ),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      isReviewed: item.product.reviews.some(
        (review) => review.orderItemId === item.id
      ),
    })),
    payment: order.payment,
  });
}

async function deleteOrder(user: Token, id: string) {
  const order = await orderRepository.getOrder(id);
  if (!order) {
    throw new NotFoundError("order", id);
  }

  if (order.userId !== user.id) {
    throw new ForbiddenError();
  }

  if (order.status !== "CompletedPayment") {
    throw new BadRequestError("잘못된 요청입니다.");
  }

  return await orderRepository.deleteOrder(id, user.id);
}

async function updateOrder(user: Token, id: string, data: UpdateOrderDTO) {
  const order = await orderRepository.getOrder(id);
  if (!order) {
    throw new NotFoundError("order", id);
  }

  if (order.userId !== user.id) {
    throw new ForbiddenError();
  }

  if (["Shipped", "Processing", "Cancelled"].includes(order.status)) {
    throw new BadRequestError("잘못된 요청입니다.");
  }

  const updatedOrder = await orderRepository.update(id, data);

  return new OrderResDTO({
    ...updatedOrder,
    totalQuantity: updatedOrder.orderItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    ),
    orderItems: updatedOrder.orderItems.map((item) => ({
      ...item,
      isReviewed: item.product.reviews.some(
        (review) => review.orderItemId === item.id
      ),
    })),
    payment: updatedOrder.payment,
  });
}

export default {
  create,
  getOrderList,
  getOrder,
  deleteOrder,
  updateOrder,
};
