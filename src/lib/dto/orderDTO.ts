import { PaymentStatus, UserType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Order, OrderItem } from "../../types/order";

// Request DTO
export type CreateOrderDTO = {
  name: string;
  phone: string;
  address: string;
  orderItems: { productId: string; sizeId: string; quantity: number }[];
  usePoint: number;
};

export type CreateOrderItemDTO = {
  productId: string;
  sizeId: string;
  quantity: number;
  price: Decimal;
};

export type UpdateUserDTO = {
  id: string;
  name?: string;
  password?: string;
  image?: string | null;
  currentPassword: string;
};

export type StockDTO = {
  productId: string;
  sizeId: string;
};

//Response DTO
export class OrderResDTO {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  subtotal: Decimal;
  totalQuantity: number;
  usePoint: number;
  createdAt: Date;
  orderItems: {
    id: string;
    price: Decimal;
    quantity: number;
    product: {
      id: string;
      storeId: string;
      name: string;
      price: Decimal;
      image: string;
      createdAt: Date;
      updatedAt: Date;
    };
    stocks: {
      id: string;
      productId: string;
      quantity: number;
      size: {
        id: string;
        size: {
          en: string;
          ko: string;
        };
      };
    };
    size: {
      id: string;
      size: {
        en: string;
        ko: string;
      };
    };
    payments: {
      id: string;
      price: Decimal;
      status: PaymentStatus;
      createdAt: Date;
      updatedAt: Date;
      orderId: string;
    };
  }[];

  constructor(order: Order & { orderItems: OrderItem[] }) {
    this.id = order.id;
    this.name = order.name;
    this.phoneNumber = order.phone;
    this.address = order.address;
    this.subtotal = order.subtotal;
    this.totalQuantity = order.totalQuantity;
    this.usePoint = order.usePoint;
    this.createdAt = order.createdAt;
    this.orderItems = order.orderItems;
  }
}
