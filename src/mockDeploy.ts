export interface GradeMock {
  id: string;
  name: string;
  pointRate: number;
  minAmount: number;
}

export interface CategoryMock {
  id: string;
  name: string;
  description: string;
}

export interface SizeMock {
  id: string;
  size: string;
}

export const GradeMocks: GradeMock[] = [
  {
    id: "grade_vip",
    name: "VIP",
    pointRate: 1,
    minAmount: 1000000,
  },
  {
    id: "grade_black",
    name: "BLACK",
    pointRate: 2,
    minAmount: 500000,
  },
  {
    id: "grade_red",
    name: "RED",
    pointRate: 3,
    minAmount: 300000,
  },
  {
    id: "grade_orange",
    name: "Orange",
    pointRate: 4,
    minAmount: 100000,
  },
  {
    id: "grade_green",
    name: "Green",
    pointRate: 5,
    minAmount: 0,
  },
];

export const CategoryMocks: CategoryMock[] = [
  {
    id: "cy7ho4p9r0dj2itnpgwkyqg1s",
    name: "book",
    description: "Security mission reveal through business.",
  },
  {
    id: "c0fm6puffcuhepnyi73xibhcr",
    name: "your",
    description: "Bank increase head nature good center perform.",
  },
  {
    id: "csev4ctimhvcocsts64xd4lym",
    name: "response",
    description: "Identify run guess pattern.",
  },
];

export const SizeMocks: SizeMock[] = [
  {
    id: "sizefree_id",
    size: "Free",
  },
  {
    id: "sizeXS_id",
    size: "XS",
  },
  {
    id: "sizeS_id",
    size: "S",
  },
  {
    id: "sizeM_id",
    size: "M",
  },
  {
    id: "sizeL_id",
    size: "L",
  },
  {
    id: "sizeXL_id",
    size: "XL",
  },
];
