// prisma/mock.ts

// Enum 타입 정의 (Prisma 스키마의 Enum과 일치하도록)
export enum UserType {
  BUYER = "BUYER",
  SELLER = "SELLER",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentStatus {
  INITIATED = "INITIATED",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
  REFUNDED = "REFUNDED",
}

export enum InquiryStatus {
  completedAnswer = "completedAnswer",
  noAnswer = "noAnswer",
}

// Mock 데이터의 인터페이스 정의
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

export interface UserMock {
  id: string;
  email: string;
  name: string;
  password: string;
  type: UserType;
  point: number;
  totalAmount: number;
  image: string | null;
  gradeId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; // Prisma schema에서 optional이므로
}

export interface StoreMock {
  id: string;
  name: string;
  userId: string;
  address: string;
  phoneNumber: string;
  image?: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; // Prisma schema에서 optional이므로
}

export interface ProductMock {
  id: string;
  name: string;
  price: number;
  image: string;
  content: string;
  categoryId: string;
  storeId: string;
  discountRate: number | null;
  discountStartTime: Date | null;
  discountEndTime: Date | null;
  sales: number;
  createdAt: Date;
  updatedAt: Date;
  sizeId: string | null; // Prisma schema에서 optional이므로
}

export interface StockMock {
  id: string;
  productId: string;
  sizeId: string;
  quantity: number;
}

export interface OrderMock {
  id: string;
  userId: string;
  address: string;
  phone: string;
  status: OrderStatus;
  usePoint: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemMock {
  id: string;
  orderId: string;
  productId: string;
  sizeId: string;
  quantity: number;
  price: number;
}

export interface PaymentMock {
  id: string;
  orderId: string;
  status: PaymentStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartMock {
  id: string;
  userId: string;
}

export interface CartItemMock {
  id: string;
  cartId: string;
  productId: string;
  sizeId: string;
  quantity: number;
}

export interface InquiryMock {
  id: string;
  productId: string;
  userId: string;
  title: string;
  content: string;
  isSecret: boolean;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReplyMock {
  id: string;
  inquiryId: string;
  userId: string;
  content: string;
  isChecked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewMock {
  id: string;
  productId: string;
  userId: string;
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoriteStoreMock {
  userId: string;
  storeId: string;
}

// 실제 Mock 데이터 배열 (타입 적용)

export const GradeMocks: GradeMock[] = [
  {
    id: "c0z9js9ub5hbpyxomf7gv24lg",
    name: "BLACK",
    pointRate: 2,
    minAmount: 100000,
  },
  {
    id: "c3ccprud77evamhrsbz17iu4n",
    name: "RED",
    pointRate: 5,
    minAmount: 200000,
  },
  {
    id: "c5rhnfb91rgct7dsb2dbykl1p",
    name: "GOLD",
    pointRate: 7,
    minAmount: 300000,
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
    id: "ciwy4l6lzo8mroub52rgg7av0",
    size: "S",
  },
  {
    id: "cuuel13i5dj2kbuzu19qs9nzl",
    size: "M",
  },
  {
    id: "ce4n3z8f3syf6q5v5pjc6qjod",
    size: "L",
  },
];

export const UserMocks: UserMock[] = [
  {
    id: "cum9sqi2o80rpi4lb7utemly4",
    name: "홍길동",
    email: "markpalmer@king-jacobs.biz",
    password: "6BW#2LkvJa",
    type: UserType.SELLER,
    point: 763,
    totalAmount: 112100,
    image: "https://dummyimage.com/402x235",
    gradeId: "c0z9js9ub5hbpyxomf7gv24lg",
    createdAt: new Date("2024-08-29T17:25:22Z"), // ISO 8601 문자열에 'Z' (UTC) 추가
    updatedAt: new Date("2025-06-17T00:49:36.837419Z"),
  },
  {
    id: "cgd5958bqeac4ctokkomgbe9o",
    email: "derek74@yahoo.com",
    name: "유관순",
    password: "+#4WuLBy5#",
    type: UserType.BUYER,
    point: 601,
    totalAmount: 31650,
    image: "https://placekitten.com/961/496",
    gradeId: "c3ccprud77evamhrsbz17iu4n",
    createdAt: new Date("2024-10-19T15:32:04Z"),
    updatedAt: new Date("2025-06-17T00:49:36.837671Z"),
  },
  {
    id: "ceaiuox6cyg3aprebyid2tdni",
    email: "kim74@gmail.com",
    name: "세종대왕",
    password: "YmDmbYYk)9",
    type: UserType.SELLER,
    point: 674,
    totalAmount: 687840,
    image: "https://placeimg.com/921/848/any",
    gradeId: "c0z9js9ub5hbpyxomf7gv24lg",
    createdAt: new Date("2024-12-03T20:07:10Z"),
    updatedAt: new Date("2025-06-17T00:49:36.837881Z"),
  },
];

export const StoreMocks: StoreMock[] = [
  {
    id: "c94p4uqnvcrw22qccfn6rt8sj",
    userId: "cum9sqi2o80rpi4lb7utemly4",
    name: "Mejia, Williams and Lee",
    address: "PSC 3321, Box 8340\nAPO AA 03995",
    phoneNumber: "001-926-775-4388x2724",
    content: "New store",
    createdAt: new Date("2025-02-17T00:33:31Z"),
    updatedAt: new Date("2025-06-17T00:49:36.838574Z"),
  },
  {
    id: "c00ybxn0zrghstc93bzxiya4q",
    name: "Jackson Group",
    userId: "ceaiuox6cyg3aprebyid2tdni",
    address: "989 Vasquez Trace\nLake Jamesview, OR 38966",
    phoneNumber: "404.273.7881",
    content: "My new store",
    createdAt: new Date("2024-09-16T23:16:03Z"),
    updatedAt: new Date("2025-06-17T00:49:36.839080Z"),
  },
];

export const ProductMocks: ProductMock[] = [
  {
    id: "crw2csg78q4tbrb9oieihe8fk",
    name: "Hart, Shepherd and Sutton",
    price: 78090,
    image: "https://placekitten.com/220/902",
    content:
      "Contain news especially less mean per. Everybody break form once ok air third. Player travel know tax special player.",
    categoryId: "cy7ho4p9r0dj2itnpgwkyqg1s",
    storeId: "c00ybxn0zrghstc93bzxiya4q",
    discountRate: 31,
    discountStartTime: new Date("2025-05-06T18:05:18Z"),
    discountEndTime: new Date("2025-06-17T00:49:36.841276Z"),
    sales: 553,
    createdAt: new Date("2025-06-06T18:46:48Z"),
    updatedAt: new Date("2025-06-17T00:49:36.841320Z"),
    sizeId: "cuuel13i5dj2kbuzu19qs9nzl",
  },
  {
    id: "cmwzmdmvlt0ruc3cxv57k9o3j",
    name: "Anderson, Anderson and Holmes",
    price: 1000,
    image: "https://placeimg.com/590/480/any",
    content:
      "Help situation right activity read budget end family. Police ten a couple maybe.\nMeeting future front run care he point. Whatever ok effort.",
    categoryId: "cy7ho4p9r0dj2itnpgwkyqg1s",
    storeId: "c00ybxn0zrghstc93bzxiya4q",
    discountRate: 29,
    discountStartTime: new Date("2024-12-14T17:06:58Z"),
    discountEndTime: new Date("2025-06-17T00:49:36.842091Z"),
    sales: 925,
    createdAt: new Date("2024-10-30T18:29:29Z"),
    updatedAt: new Date("2025-06-17T00:49:36.842134Z"),
    sizeId: "ce4n3z8f3syf6q5v5pjc6qjod",
  },
  {
    id: "c9od5fczfo8xva5zolk9uu95t",
    name: "Martin, Lewis and Reeves",
    price: 11890,
    image: "https://placeimg.com/357/507/any",
    content:
      "Young class huge who sing perform. Relate group population upon line. Tend represent baby whatever deep range nation.\nLeader will success range clear customer.",
    categoryId: "c0fm6puffcuhepnyi73xibhcr",
    storeId: "c00ybxn0zrghstc93bzxiya4q",
    discountRate: 6,
    discountStartTime: new Date("2024-10-16T08:24:16Z"),
    discountEndTime: new Date("2025-06-17T00:49:36.842909Z"),
    sales: 877,
    createdAt: new Date("2024-10-25T22:24:59Z"),
    updatedAt: new Date("2025-06-17T00:49:36.842951Z"),
    sizeId: "ce4n3z8f3syf6q5v5pjc6qjod",
  },
];

export const StockMocks: StockMock[] = [
  {
    id: "c7amb4sh35f4yyfc6bnoyo57f",
    productId: "crw2csg78q4tbrb9oieihe8fk",
    sizeId: "cuuel13i5dj2kbuzu19qs9nzl",
    quantity: 42,
  },
  {
    id: "c9gshfl1ndrf0gumtcjqmxz8u",
    productId: "cmwzmdmvlt0ruc3cxv57k9o3j",
    sizeId: "ce4n3z8f3syf6q5v5pjc6qjod",
    quantity: 55,
  },
  {
    id: "cuykr7k8pql5ugcdokmo199gy",
    productId: "crw2csg78q4tbrb9oieihe8fk",
    sizeId: "cuuel13i5dj2kbuzu19qs9nzl",
    quantity: 70,
  },
];

export const OrderMocks: OrderMock[] = [
  {
    id: "cjh46mhbe8zmnmptiq5s92v8p",
    userId: "ceaiuox6cyg3aprebyid2tdni",
    address: "50508 Daniel Lane Suite 855\nBrittanymouth, AR 87340",
    phone: "+1-635-820-1800x49054",
    status: OrderStatus.PAID,
    usePoint: 0,
    subtotal: 2000,
    createdAt: new Date("2025-02-03T17:00:26Z"),
    updatedAt: new Date("2025-06-17T00:49:36.843966Z"),
  },
  {
    id: "cbcow31a0czhkpzedpeo4tig5",
    userId: "cgd5958bqeac4ctokkomgbe9o",
    address: "0407 Armstrong Lodge Suite 350\nPerezstad, AR 03406",
    phone: "+1-564-702-6393x14480",
    status: OrderStatus.PENDING,
    usePoint: 50,
    subtotal: 5000,
    createdAt: new Date("2025-04-25T13:31:51Z"),
    updatedAt: new Date("2025-06-17T00:49:36.844626Z"),
  },
  {
    id: "cfnkcrp7iw6kci6f9v1m9rum6",
    userId: "ceaiuox6cyg3aprebyid2tdni",
    address: "71464 Collins Wall\nNewtonbury, RI 02718",
    phone: "+1-925-884-5267x2650",
    status: OrderStatus.CANCELLED,
    usePoint: 0,
    subtotal: 5000,
    createdAt: new Date("2024-06-23T21:07:47Z"),
    updatedAt: new Date("2025-06-17T00:49:36.845146Z"),
  },
];

export const OrderItemMocks: OrderItemMock[] = [
  {
    id: "ctnqd5svtp9gwcscrm3ma115n",
    orderId: "cfnkcrp7iw6kci6f9v1m9rum6",
    productId: "cmwzmdmvlt0ruc3cxv57k9o3j",
    sizeId: "ce4n3z8f3syf6q5v5pjc6qjod",
    quantity: 5,
    price: 1000,
  },
  {
    id: "caweanurlxn6u6luc1vofi8mi",
    orderId: "cjh46mhbe8zmnmptiq5s92v8p",
    productId: "cmwzmdmvlt0ruc3cxv57k9o3j",
    sizeId: "ciwy4l6lzo8mroub52rgg7av0",
    quantity: 2,
    price: 1000,
  },
  {
    id: "cg4dysvho57649bsy895r09r6",
    orderId: "cbcow31a0czhkpzedpeo4tig5",
    productId: "cmwzmdmvlt0ruc3cxv57k9o3j",
    sizeId: "ciwy4l6lzo8mroub52rgg7av0",
    quantity: 5,
    price: 1000,
  },
];

export const PaymentMocks: PaymentMock[] = [
  {
    id: "cobbwjg7bfwlrr4bxid796vqn",
    orderId: "cjh46mhbe8zmnmptiq5s92v8p",
    status: PaymentStatus.SUCCESS,
    totalPrice: 2000,
    createdAt: new Date("2024-10-15T11:02:32Z"),
    updatedAt: new Date("2025-06-17T00:49:36.845733Z"),
  },
  {
    id: "coxuse3zmr9orxomjzrj7kjdh",
    orderId: "cbcow31a0czhkpzedpeo4tig5",
    status: PaymentStatus.INITIATED,
    totalPrice: 5000,
    createdAt: new Date("2025-04-04T15:52:25Z"),
    updatedAt: new Date("2025-06-17T00:49:36.845783Z"),
  },
  {
    id: "cweef8hhbp0fswumrmm2erbeh",
    orderId: "cfnkcrp7iw6kci6f9v1m9rum6",
    status: PaymentStatus.REFUNDED,
    totalPrice: 5000,
    createdAt: new Date("2024-08-11T21:59:21Z"),
    updatedAt: new Date("2025-06-17T00:49:36.845830Z"),
  },
];

export const CartMocks: CartMock[] = [
  {
    id: "c6kmlb08w3wihfs7wv1s6uu84",
    userId: "cum9sqi2o80rpi4lb7utemly4",
  },
  {
    id: "cjd4vsq81a0cx1a2tkti3ekq5",
    userId: "cgd5958bqeac4ctokkomgbe9o",
  },
  {
    id: "c7rq3ylymzzirbyuoabb1uhdt",
    userId: "ceaiuox6cyg3aprebyid2tdni",
  },
];

export const CartItemMocks: CartItemMock[] = [
  {
    id: "cepj3qgkndjgxlqsegsswng4a",
    cartId: "cjd4vsq81a0cx1a2tkti3ekq5",
    productId: "crw2csg78q4tbrb9oieihe8fk",
    sizeId: "ce4n3z8f3syf6q5v5pjc6qjod",
    quantity: 2,
  },
  {
    id: "c4ifblg7y09vujxzzqd1i5p0b",
    cartId: "cjd4vsq81a0cx1a2tkti3ekq5",
    productId: "crw2csg78q4tbrb9oieihe8fk",
    sizeId: "cuuel13i5dj2kbuzu19qs9nzl",
    quantity: 6,
  },
  {
    id: "cf8nh623cxrb746jghw62pznu",
    cartId: "c6kmlb08w3wihfs7wv1s6uu84",
    productId: "cmwzmdmvlt0ruc3cxv57k9o3j",
    sizeId: "ce4n3z8f3syf6q5v5pjc6qjod",
    quantity: 3,
  },
];

export const InquiryMocks: InquiryMock[] = [
  {
    id: "c7b9iex3tiom7iocis4y7k3s4",
    productId: "cmwzmdmvlt0ruc3cxv57k9o3j",
    userId: "ceaiuox6cyg3aprebyid2tdni",
    title: "Traditional brother.",
    content:
      "In six for office live. Husband vote situation through big artist reduce.\nAlmost onto so option Mrs sound. Close relate reduce score daughter impact rise. Until top trouble parent.",
    isSecret: true,
    status: InquiryStatus.noAnswer,
    createdAt: new Date("2025-04-28T04:19:38Z"),
    updatedAt: new Date("2025-06-17T00:49:36.846375Z"),
  },
  {
    id: "cnr9514f7arpehh32f97odbxt",
    productId: "crw2csg78q4tbrb9oieihe8fk",
    userId: "cgd5958bqeac4ctokkomgbe9o",
    title: "Send smile society represent.",
    content:
      "Last just once forward act international.\nSecurity necessary believe yet picture rule. Career against avoid bank. Policy what three tree official draw.",
    isSecret: true,
    status: InquiryStatus.completedAnswer,
    createdAt: new Date("2024-10-18T15:57:38Z"),
    updatedAt: new Date("2025-06-17T00:49:36.846533Z"),
  },
  {
    id: "c0q606ct9yniuouyn2oc8zcbt",
    productId: "cmwzmdmvlt0ruc3cxv57k9o3j",
    userId: "cum9sqi2o80rpi4lb7utemly4",
    title: "Pass rich check.",
    content:
      "Data new service hope watch wall strong. Bring participant but. Question senior news care leg television.\nResponse standard cover modern late ok door. Hope north still marriage just thought raise.",
    isSecret: false,
    status: InquiryStatus.completedAnswer,
    createdAt: new Date("2025-01-14T11:00:20Z"),
    updatedAt: new Date("2025-06-17T00:49:36.846689Z"),
  },
];

export const ReplyMocks: ReplyMock[] = [
  {
    id: "culs2whdc3jol8wbf432g8iym",
    inquiryId: "cnr9514f7arpehh32f97odbxt",
    userId: "ceaiuox6cyg3aprebyid2tdni",
    content: "Debate clear Congress Congress occur ahead.",
    isChecked: false,
    createdAt: new Date("2025-01-22T06:52:16Z"),
    updatedAt: new Date("2025-06-17T00:49:36.846908Z"),
  },
  {
    id: "ckyyb8gwy67sq4z9tivmhgngx",
    inquiryId: "c0q606ct9yniuouyn2oc8zcbt",
    userId: "ceaiuox6cyg3aprebyid2tdni",
    content: "Help bar key west large.",
    isChecked: true,
    createdAt: new Date("2025-03-05T15:23:18Z"),
    updatedAt: new Date("2025-06-17T00:49:36.847054Z"),
  },
];

export const ReviewMocks: ReviewMock[] = [
  {
    id: "clpj0r27m1p7tro6epxgjqe92",
    productId: "c9od5fczfo8xva5zolk9uu95t",
    userId: "cum9sqi2o80rpi4lb7utemly4",
    content: "View record perhaps shake exist garden wear.",
    rating: 4.8,
    createdAt: new Date("2024-08-13T17:17:58Z"),
    updatedAt: new Date("2025-06-17T00:49:36.847293Z"),
  },
  {
    id: "cphg9p1bpm2ch2fh2p93gait7",
    productId: "crw2csg78q4tbrb9oieihe8fk",
    userId: "cgd5958bqeac4ctokkomgbe9o",
    content: "Minute fill speak five else seat candidate.",
    rating: 4.7,
    createdAt: new Date("2024-12-05T03:32:39Z"),
    updatedAt: new Date("2025-06-17T00:49:36.847376Z"),
  },
  {
    id: "c03cv8l1fva7di24cpju83w25",
    productId: "crw2csg78q4tbrb9oieihe8fk",
    userId: "ceaiuox6cyg3aprebyid2tdni",
    content: "Partner ground ask reach program seem.",
    rating: 2.4,
    createdAt: new Date("2024-12-31T04:42:43Z"),
    updatedAt: new Date("2025-06-17T00:49:36.847446Z"),
  },
];

export const FavoriteStoreMocks: FavoriteStoreMock[] = [
  {
    userId: "ceaiuox6cyg3aprebyid2tdni",
    storeId: "c00ybxn0zrghstc93bzxiya4q",
  },
  {
    userId: "cum9sqi2o80rpi4lb7utemly4",
    storeId: "c00ybxn0zrghstc93bzxiya4q",
  },
];
