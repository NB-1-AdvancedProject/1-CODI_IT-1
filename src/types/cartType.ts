import { Decimal } from "@prisma/client/runtime/library";

export interface CartData {
  id: string;
  userId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SizeData {
  id: string;
  size: string;
}

export interface StockData {
  id: string;
  productId: string;
  sizeId: string;
  quantity: number;
  size: SizeData;
}

export interface StoreData {
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

export interface ProductData {
  id: string;
  storeId: string;
  name: string;
  price: Decimal;
  image: string;
  discountRate: number | null;
  discountStartTime: Date | null;
  discountEndTime: Date | null;
  store: StoreData;
  stocks: StockData[];
}

export interface CartItemData {
  id: string;
  cartId: string;
  productId: string;
  sizeId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: ProductData;
  cart: CartData;
}

export interface GetCartItemData {
  id: string;
  cartId: string;
  productId: string;
  sizeId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: ProductData;
}

export interface CartList {
  id: string;
  userId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  cartItems: GetCartItemData[];
}

export interface SizeLeanguage {
  ko: string;
  en: string;
}
