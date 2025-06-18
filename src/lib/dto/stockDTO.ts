import { SizeDTO } from "./SizeDTO";

export class StockDTO {
  id: string;
  productId: string;
  sizeId: string;
  quantity: number;
  size: SizeDTO;

  constructor(
    id: string,
    productId: string,
    quantity: number,
    sizeId: string,
    size: SizeDTO
  ) {
    this.id = id;
    this.productId = productId;
    this.sizeId = sizeId;
    this.size = size;
    this.quantity = quantity;
  }
}

export class StocksReponseDTO {
  stocks: StockDTO[];

  constructor(stocks: StockDTO[]) {
    this.stocks = stocks;
  }
}
