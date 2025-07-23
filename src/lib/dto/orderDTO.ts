import { PaymentStatus, Size } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Order, OrderItem, OrderItemPayment, Product } from "../../types/order";
import { SizeDTO } from "./SizeDTO";

// Request DTO
export type CreateOrderDTO = {
  name: string;
  phone: string;
  address: string;
  orderItems: { productId: string; sizeId: number; quantity: number }[];
  usePoint: number;
};

export type CreateOrderItemDTO = {
  productId: string;
  sizeId: number;
  quantity: number;
  price: Decimal;
};

export type UpdateOrderDTO = Partial<CreateOrderDTO>;

export type CreateOrderData = {
  name: string;
  phone: string;
  address: string;
  subtotal: Decimal;
  usePoint: number;
  orderItems: {
    productId: string;
    sizeId: number;
    quantity: number;
    price: Decimal;
  }[];
  payment: {
    totalPrice: Decimal;
  };
};

export type StockDTO = {
  productId: string;
  sizeId: number;
};

type OrderWithRelations = Order & {
  orderItems: (OrderItem & {
    product: Product;
    size: Size;
  })[];
  payment: OrderItemPayment | null;
};

//Response DTO
export class OrderResDTO {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  subtotal: string;
  totalQuantity: number;
  usePoint: number;
  createdAt: Date;
  orderItems: {
    id: string;
    price: Decimal;
    quantity: number;
    product: Product;
    size: SizeDTO;
  }[];
  payments: {
    id: string;
    price: Decimal;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
    orderId: string;
  } | null;

  constructor(order: OrderWithRelations) {
    this.id = order.id;
    this.name = order.name;
    this.phoneNumber = order.phone;
    this.address = order.address;
    this.subtotal = order.subtotal.toString();
    this.totalQuantity = order.totalQuantity;
    this.usePoint = order.usePoint;
    this.createdAt = order.createdAt;
    this.orderItems = order.orderItems.map((item) => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        storeId: item.product.storeId,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        createdAt: item.product.createdAt,
        updatedAt: item.product.updatedAt,
        store: item.product.store,
        stocks: item.product.stocks.map((stock) => ({
          id: stock.id,
          productId: stock.productId,
          quantity: stock.quantity,
          size: stock.size,
        })),
      },
      size: new SizeDTO(item.size),
    }));

    this.payments = order.payment
      ? {
          id: order.payment.id,
          price: order.payment.totalPrice,
          status: order.payment.status,
          createdAt: order.payment.createdAt,
          updatedAt: order.payment.updatedAt,
          orderId: order.payment.orderId,
        }
      : null;
  }
}
