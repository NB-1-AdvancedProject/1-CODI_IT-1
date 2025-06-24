import { OrderStatus, PaymentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface Order {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: OrderStatus;
  usePoint: number;
  subtotal: Decimal;
  totalQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  paidAt: Date;
}

export interface OrderItemPayment {
  id: string;
  price: Decimal;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
}

// Size 타입
export interface Size {
  id: string;
  size: {
    en: string;
    ko: string;
  };
}

// Stock 타입
export interface Stock {
  id: string;
  productId: string;
  quantity: number;
  size: Size;
}

// Product 타입
export interface Product {
  id: string;
  storeId: string;
  name: string;
  price: Decimal;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// OrderItem 타입
export interface OrderItem {
  id: string;
  price: Decimal;
  quantity: number;
  product: Product;
  stocks: Stock;
  size: Size;
  payments: OrderItemPayment;
}
