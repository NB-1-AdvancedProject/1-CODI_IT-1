// Entity

export interface Store {
  id: string;
  name: string;
  address: string;
  detailAddress: string | null;
  phoneNumber: string;
  userId: string;
  image?: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// Input
