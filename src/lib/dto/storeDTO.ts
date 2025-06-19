import { Store } from "../../types/storeType";

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

// Input (serivce <-> repository 간)
export type CreateStoreInput = Omit<CreateStoreDTO, "userType">;
