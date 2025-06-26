// 다른 도메인 Type 사용
// 정은 : 리팩토링 시 겹치는지 확인 필요

import { Decimal } from "@prisma/client/runtime/library";

// Entity
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sizeId: string;
  quantity: number;
  price: Decimal;
}
