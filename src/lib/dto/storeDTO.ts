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

// Input (serivce <-> repository 간)
export type CreateStoreInput = Omit<CreateStoreDTO, "userType">;
