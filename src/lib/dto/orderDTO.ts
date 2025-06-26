import { PaymentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {
  Order,
  OrderItem,
  OrderItemPayment,
  Product,
  Size,
} from "../../types/order";

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

export type UpdateOrderDTO = Partial<CreateOrderDTO>;

export type CreateOrderData = {
  name: string;
  phone: string;
  address: string;
  subtotal: Decimal;
  usePoint: number;
  orderItems: {
    productId: string;
    sizeId: string;
    quantity: number;
    price: Decimal;
  }[];
  payment: {
    totalPrice: Decimal;
  };
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
    product: {
      id: string;
      storeId: string;
      name: string;
      price: Decimal;
      image: string;
      createdAt: Date;
      updatedAt: Date;
      store: {
        id: string;
        userId: string;
        name: string;
        address: string;
        phoneNumber: string;
        content: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      stocks: {
        id: string;
        productId: string;
        quantity: number;
        size: {
          id: string;
          size: string;
        };
      }[];
    };
    size: {
      id: string;
      size: string;
    };
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
          size: {
            id: stock.size.id,
            size: stock.size.size,
          },
        })),
      },
      size: item.size,
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
