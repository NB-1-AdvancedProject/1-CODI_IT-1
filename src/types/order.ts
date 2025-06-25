import { OrderStatus, PaymentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type OrderStatusType = `${OrderStatus}`;
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
  paidAt: Date | null;
}

export interface OrderItemPayment {
  id: string;
  totalPrice: Decimal;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
}

// Size 타입
export interface Size {
  id: string;
  size: string;
}

// Stock 타입
export interface Stock {
  id: string;
  productId: string;
  quantity: number;
  size: Size;
}

// Store 타입
export interface Store {
  id: string;
  userId: string;
  name: string;
  address: string;
  phoneNumber: string;
  content: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  store: Store;
  stocks: Stock[];
}

// OrderItem 타입
export interface OrderItem {
  id: string;
  price: Decimal;
  quantity: number;
  product: Product;
  size: Size;
}
