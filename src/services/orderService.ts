import { CreateOrderDTO, OrderResDTO, StockDTO } from "../lib/dto/orderDTO";
import CommonError from "../lib/errors/CommonError";
import NotFoundError from "../lib/errors/NotFoundError";
import orderRepository from "../repositories/orderRepository";
import { Token } from "../types/user";

async function create(user: Token, data: CreateOrderDTO) {
  const products = await Promise.all(
    data.orderItems.map((item) => getProductById(item.productId))
  );

  const notFoundProductIds = data.orderItems
    .map((item, idx) => (!products[idx] ? item.productId : null))
    .filter((id): id is string => id !== null);

  if (notFoundProductIds.length > 0) {
    notFoundProductIds.forEach((id) => {
      throw new NotFoundError("product", id);
    });
  }

  const stocks = await orderRepository.getStock(data.orderItems);

  for (const item of data.orderItems) {
    const stock = stocks.find(
      (s) => s.productId === item.productId && s.sizeId === item.sizeId
    );

    if (!stock || stock.quantity < item.quantity) {
      throw new CommonError("재고가 부족합니다.", 400);
    }
  }

  if (user.point < data.usePoint) {
    throw new CommonError("포인트가 부족합니다.", 400);
  }
  const createOrder = await orderRepository.orderSave(user, data);

  const fullOrderData = {
    ...createOrder,
    totalQuantity: data.orderItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    ),
    orderItems: createOrder.orderItems,
    payment: createOrder.payment,
  };

  return new OrderResDTO(fullOrderData);
}

async function getProductById(productId: string) {
  return await orderRepository.getProductById(productId);
}

async function getStock(orderItems: StockDTO[]) {
  return await orderRepository.getStock(orderItems);
}

export default {
  create,
};
