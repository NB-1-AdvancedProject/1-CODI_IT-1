import { UserType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Request
export type GetDashboardDTO = {
  userId: string;
  userType: UserType;
};

// Response
export type DashboardDTO = {
  today: PeriodStat;
  week: PeriodStat;
  month: PeriodStat;
  year: PeriodStat;
  topSales: TopSale[];
  priceRange: PriceRange[];
};

export type PriceRange = {
  priceRange: string;
  totalSales: number;
  percentage: number;
};

export type TopSale = {
  totalOrders: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
};

export type SalesSummary = {
  totalOrders: number;
  totalSales: number;
};

export type PeriodStat = {
  current: SalesSummary;
  previous: SalesSummary;
  changeRate: {
    totalOrders: number;
    totalSales: number;
  };
};
// Input (Service <-> Repository)
