import { Product, Stock } from "@prisma/client";
import { Store } from "../../types/storeType";
import { Decimal } from "@prisma/client/runtime/library";

// Request DTO
export type CreateStoreDTO = {
  name: string;
  address: string;
  phoneNumber: string;
  content: string;
  image?: string;
  userId: string;
  userType: string;
};

export type GetMyStoreProductsDTO = {
  userId: string;
  page: number;
  pageSize: number;
};

export type UpdateMyStoreDTO = {
  userId: string;
  storeId: string;
  name?: string;
  address?: string;
  phoneNumber?: string;
  content?: string;
  image?: string;
};

export type FavoriteStoreTargetDTO = {
  userId: string;
  storeId: string;
};

// Response DTO
export class StoreResDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  address: string;
  phoneNumber: string;
  content: string;
  image: string;

  constructor(store: Store) {
    this.id = store.id;
    this.name = store.name;
    this.createdAt = store.createdAt;
    this.updatedAt = store.updatedAt;
    this.userId = store.userId;
    this.address = store.address;
    this.phoneNumber = store.phoneNumber;
    this.content = store.content;
    this.image = store.image || "";
  }
}

export class StoreWithFavoriteCountDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  address: string;
  phoneNumber: string;
  content: string;
  image: string;
  favoriteCount: number;

  constructor(store: Store, favoriteCount: number) {
    this.id = store.id;
    this.name = store.name;
    this.createdAt = store.createdAt;
    this.updatedAt = store.updatedAt;
    this.userId = store.userId;
    this.address = store.address;
    this.phoneNumber = store.phoneNumber;
    this.content = store.content;
    this.image = store.image || "";
    this.favoriteCount = favoriteCount;
  }
}
export class MyStoreDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  address: string;
  phoneNumber: string;
  content: string;
  image: string;
  favoriteCount: number;
  productCount: number;
  monthFavoriteCount: number;

  constructor(
    store: Store,
    favoriteCount: number,
    productCount: number,
    monthFavoriteCount: number
  ) {
    this.id = store.id;
    this.name = store.name;
    this.createdAt = store.createdAt;
    this.updatedAt = store.updatedAt;
    this.userId = store.userId;
    this.address = store.address;
    this.phoneNumber = store.phoneNumber;
    this.content = store.content;
    this.image = store.image || "";
    this.favoriteCount = favoriteCount;
    this.productCount = productCount;
    this.monthFavoriteCount = monthFavoriteCount;
  }
}

export type MyStoreProductsDTO = {
  list: MyStoreProductDTO[];
  totalCount: number;
};

export class FavoriteStoreResDTO {
  type: favoriteStoreType;
  store: StoreResDTO;

  constructor(type: favoriteStoreType, store: Store) {
    this.type = type;
    this.store = new StoreResDTO(store);
  }
}
// Input (serivce <-> repository 간)
export type CreateStoreInput = Omit<CreateStoreDTO, "userType">;
export type FindMyStoreProductsInput = {
  storeId: string;
  page: number;
  pageSize: number;
};

export type UpdateStoreInput = Omit<UpdateMyStoreDTO, "userId">;

// 다른 도메인 DTO
// 정은 Todo: 나중에 겹치는지 체크 필요
export type ProductWithStocks = Product & {
  stocks: Stock[];
};
export class MyStoreProductDTO {
  id: string;
  image: string;
  name: string;
  price: number;
  stocks: Stock[]; // 정은 Todo: 스웨거 확정되면 수정 필요
  isDiscount: boolean;
  isSoldOut: boolean;
  createdAt: Date;

  constructor(product: ProductWithStocks) {
    this.id = product.id;
    this.image = product.image || "";
    this.name = product.name;
    this.price = product.price.toNumber();
    this.stocks = product.stocks;
    this.isDiscount = product.discountEndTime
      ? product.discountEndTime > new Date()
      : false;
    this.createdAt = product.createdAt;
    const totalStock = product.stocks.reduce(
      (sum, stock) => sum + stock.quantity,
      0
    );
    this.isSoldOut = totalStock === 0 ? true : false;
  }
}

// Enum
export enum favoriteStoreType {
  register = "register",
  delete = "delete",
}
