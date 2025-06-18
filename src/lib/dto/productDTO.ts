import { StockDTO, StocksReponseDTO } from "./stockDTO";

export class DetailProductResponseDTO {
  id: string;
  name: string;
  content: string;
  price: number;
  image: string;
  stocks: StocksReponseDTO;

  constructor(
    id: string,
    name: string,
    content: string,
    price: number,
    image: string,
    createdAt: Date,
    updatedAt: Date,
    discountRate: number | null,
    discountStartTime: Date | null,
    discountEndTime: Date | null,
    category: { id: string; name: string }, //DTO 로 처리필요
    rewiews: {
      id: string;
      content: string;
      rating: number;
      createdAt: Date;
      updatedAt: Date;
      user: { id: string; name: string }; //DTO로 처리필요
    }[], //DTO로 처리필요
    stocks: StocksReponseDTO
  ) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.price = price;
    this.image = image;
    this.stocks = stocks;
  }
}
