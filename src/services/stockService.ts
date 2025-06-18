import { SizeDTO } from "../lib/dto/SizeDTO";
import { StockDTO } from "../lib/dto/stockDTO";
import stockRepository from "../repositories/stockRepository";

async function createStocks(
  stocks: { sizeId: string; quantity: number }[],
  productId: string
) {
  const newDatas = stocks.map((stock) => ({
    product: { connect: { id: productId } },
    size: {
      connect: { id: stock.sizeId },
    },
    quantity: stock.quantity,
  }));
  const createdStocks = await stockRepository.createStocks(newDatas);

  return createdStocks.map(
    (stock) =>
      new StockDTO(
        stock.id,
        stock.productId,
        stock.quantity,
        stock.sizeId,
        new SizeDTO(stock.size.id, stock.size.size)
      )
  );
}
export default {
  createStocks,
};
