import { Prisma, Product, UserType } from "@prisma/client";
import {
  DashboardDTO,
  GetDashboardDTO,
  PeriodStat,
  PriceRange,
  SalesSummary,
  TopSale,
} from "../lib/dto/dashboardDTO";
import UnauthError from "../lib/errors/UnauthError";
import * as storeRepository from "../repositories/storeRepository";
import * as dashboardRepository from "../repositories/dashboardRepository";
import NotFoundError from "../lib/errors/NotFoundError";
import { Decimal } from "@prisma/client/runtime/library";

export async function getDashboard(
  dto: GetDashboardDTO
): Promise<DashboardDTO> {
  const { userId, userType } = dto;
  if (userType !== UserType.SELLER) {
    throw new UnauthError();
  }
  const store = await storeRepository.findStoreByUserId(userId);
  if (!store) {
    throw new NotFoundError("Store", `userId: ${userId}`);
  }

  const today = await getTodayPeriodStats(store.id);
  const week = await getWeekPeriodStats(store.id);
  const month = await getMonthPeriodStats(store.id);
  const year = await getYearPeriodStats(store.id);

  const topSalesProducts = await dashboardRepository.getTopSales(store.id);
  const topSales = mapToTopSales(topSalesProducts);

  const ranges = [
    { priceRange: "만원 미만", minPrice: 0, maxPrice: 10000 },
    { priceRange: "만원 이상 오만원 미만", minPrice: 10000, maxPrice: 50000 },
    {
      priceRange: "오만원 이상 십만원 미만",
      minPrice: 50000,
      maxPrice: 100000,
    },
    { priceRange: "십만원 초과", minPrice: 100000, maxPrice: 999999999999 },
  ];

  const totalSalesPerRange = await Promise.all(
    ranges.map((range) => {
      return getTotalSalesByPriceRange(
        store.id,
        range.minPrice,
        range.maxPrice
      );
    })
  );

  const totalSales = totalSalesPerRange.reduce((acc, sales) => acc + sales, 0);
  const priceRange: PriceRange[] = totalSalesPerRange.map((sales, indx) => ({
    priceRange: ranges[indx].priceRange,
    totalSales: sales,
    percentage: totalSales === 0 ? 0 : Math.round((sales / totalSales) * 100),
  }));

  return { today, week, month, year, topSales, priceRange };
}

async function getTodayPeriodStats(storeId: string): Promise<PeriodStat> {
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  const [current, previous] = await Promise.all([
    getSalesSummary(storeId, todayStart),
    getSalesSummary(storeId, yesterdayStart, todayStart),
  ]);

  const changeRate = calculateChangeRate(current, previous);
  return { current, previous, changeRate };
}

async function getWeekPeriodStats(storeId: string): Promise<PeriodStat> {
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const [current, previous] = await Promise.all([
    getSalesSummary(storeId, thisWeekStart),
    getSalesSummary(storeId, lastWeekStart, thisWeekStart),
  ]);

  const changeRate = calculateChangeRate(current, previous);
  return { current, previous, changeRate };
}

async function getMonthPeriodStats(storeId: string): Promise<PeriodStat> {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  thisMonthStart.setHours(0, 0, 0, 0);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  lastMonthStart.setHours(0, 0, 0, 0);

  const [current, previous] = await Promise.all([
    getSalesSummary(storeId, thisMonthStart),
    getSalesSummary(storeId, lastMonthStart, thisMonthStart),
  ]);

  const changeRate = calculateChangeRate(current, previous);
  return { current, previous, changeRate };
}
async function getYearPeriodStats(storeId: string): Promise<PeriodStat> {
  const now = new Date();
  const thisYearStart = new Date(now.getFullYear(), 0, 1);
  thisYearStart.setHours(0, 0, 0, 0);
  const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
  lastYearStart.setHours(0, 0, 0, 0);
  const lastYearEnd = new Date(thisYearStart);
  lastYearEnd.setMilliseconds(-1);

  const [current, previous] = await Promise.all([
    getSalesSummary(storeId, thisYearStart),
    getSalesSummary(storeId, lastYearStart, thisYearStart),
  ]);

  const changeRate = calculateChangeRate(current, previous);
  return { current, previous, changeRate };
}

async function getSalesSummary(
  storeId: string,
  start: Date,
  end?: Date
): Promise<SalesSummary> {
  const option = {
    where: {
      product: { storeId },
      order: { paidAt: { gte: start, ...(end ? { lt: end } : {}) } },
    },
  };

  const orderItems = await dashboardRepository.findOrderItemsByOption(option);

  const totalOrders = orderItems.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);
  const totalSales = orderItems
    .reduce((acc, item) => {
      const price = new Decimal(item.price);
      const quantity = new Decimal(item.quantity);
      return acc.plus(price.mul(quantity));
    }, new Decimal(0))
    .toNumber();

  return { totalOrders, totalSales };
}

function calculateChangeRate(current: SalesSummary, previous: SalesSummary) {
  const totalOrders =
    previous.totalOrders === 0
      ? 0
      : Math.round((current.totalOrders / previous.totalOrders) * 100);
  const totalSales =
    previous.totalSales === 0
      ? 0
      : Math.round((current.totalSales / previous.totalSales) * 100);
  return { totalOrders, totalSales };
}

function mapToTopSales(products: Product[]): TopSale[] {
  const topSales = products.map((p) => {
    const totalOrders = p.sales;
    const product = {
      id: p.id,
      name: p.name,
      price: p.price.toNumber(),
    };
    return { totalOrders, product };
  });
  return topSales;
}

async function getTotalSalesByPriceRange(
  storeId: string,
  minPrice: number,
  maxPrice: number
): Promise<number> {
  const option: Prisma.OrderItemFindManyArgs = {
    where: {
      product: {
        is: {
          storeId,
          price: { gte: minPrice, lt: maxPrice },
        },
      },
    },
    select: { price: true, quantity: true },
  };

  const orderItems = await dashboardRepository.findOrderItemsByOption(option);
  const totalSales = orderItems
    .reduce((acc, item) => {
      const price = new Decimal(item.price);
      const quantity = new Decimal(item.quantity);
      return acc.plus(price.mul(quantity));
    }, new Decimal(0))
    .toNumber();
  return totalSales;
}
