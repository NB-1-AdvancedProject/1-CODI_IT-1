import { InquiryStatus } from "@prisma/client";

export interface InquiryListResponseDTO {
  list: InquiryItem[];
  totalCount: number;
}

export interface InquiryItem {
  id: string;
  title: string;
  isSecret: boolean;
  status: InquiryStatus;
  product: {
    id: string;
    name: string;
    image: string;
    store: {
      id: string;
      name: string;
    };
  };
}
