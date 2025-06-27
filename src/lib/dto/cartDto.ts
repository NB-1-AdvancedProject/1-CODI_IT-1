import { Decimal } from "@prisma/client/runtime/library";
import {
  CartData,
  SizeData,
  StockData,
  SizeLeanguage,
  StoreData,
  ProductData,
  GetCartItemData,
  CartList,
  CartItemData,
} from "../../types/cartType";

export class cartDTO {
  id: string;
  buyerId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  constructor(cart: CartData) {
    this.id = cart.id;
    this.buyerId = cart.userId;
    this.quantity = cart.quantity;
    this.createdAt = cart.createdAt.toISOString();
    this.updatedAt = cart.updatedAt.toISOString();
  }
}

export class getCartItemDTO {
  id: string;
  cartId: string;
  productId: string;
  sizeId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: productDTO;

  constructor(cartItems: GetCartItemData) {
    this.id = cartItems.id;
    this.cartId = cartItems.cartId;
    this.productId = cartItems.productId;
    this.sizeId = cartItems.sizeId;
    this.quantity = cartItems.quantity;
    this.createdAt = cartItems.createdAt.toISOString();
    this.updatedAt = cartItems.updatedAt.toISOString();
    this.product = new productDTO(cartItems.product);
  }
}

export class cartItemDTO {
  id: string;
  cartId: string;
  productId: string;
  sizeId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: productDTO;
  cart: cartDTO;

  constructor(cartItems: CartItemData) {
    this.id = cartItems.id;
    this.cartId = cartItems.cartId;
    this.productId = cartItems.productId;
    this.sizeId = cartItems.sizeId;
    this.quantity = cartItems.quantity;
    this.createdAt = cartItems.createdAt.toISOString();
    this.updatedAt = cartItems.updatedAt.toISOString();
    this.product = new productDTO(cartItems.product);
    this.cart = new cartDTO(cartItems.cart);
  }
}

export class productDTO {
  id: string;
  storeId: string;
  name: string;
  price: Number;
  image: string;
  discountRate: Number | null;
  discountStartTime: string | null;
  discountEndTime: string | null;
  store: storeDTO;
  stocks: stockDTO[];

  constructor(products: ProductData) {
    this.id = products.id;
    this.storeId = products.storeId;
    this.name = products.name;
    this.price = products.price.toNumber();
    this.image = products.image;
    this.discountRate = products.discountRate;
    this.discountStartTime = products.discountStartTime
      ? products.discountStartTime.toISOString()
      : null;
    this.discountEndTime = products.discountEndTime
      ? products.discountEndTime.toISOString()
      : null;
    this.store = new storeDTO(products.store);
    this.stocks = products.stocks.map((stock) => new stockDTO(stock));
  }
}

export class storeDTO {
  id: string;
  userId: string;
  name: string;
  address: string;
  phoneNmuber: string | null;
  content: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;

  constructor(stores: StoreData) {
    this.id = stores.id;
    this.userId = stores.userId;
    this.name = stores.name;
    this.address = stores.address;
    this.phoneNmuber = stores.phoneNumber || null;
    this.content = stores.content;
    this.image = stores.image || null;
    this.createdAt = stores.createdAt.toISOString();
    this.updatedAt = stores.updatedAt.toISOString();
  }
}

export class stockDTO {
  id: string;
  productId: string;
  sizeId: string;
  quantity: number;
  size: sizeDTO;

  constructor(stocks: StockData) {
    this.id = stocks.id;
    this.productId = stocks.productId;
    this.sizeId = stocks.sizeId;
    this.quantity = stocks.quantity;
    this.size = new sizeDTO(stocks.size);
  }
}

export class sizeDTO {
  id: string;
  size: SizeLeanguage;

  constructor(sizes: SizeData) {
    this.id = sizes.id;
    this.size = {
      ko: sizes.size[0],
      en: sizes.size,
    };
  }
}

export class cartListDTO {
  id: string;
  buyerId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  items: getCartItemDTO[];

  constructor(carts: CartList) {
    this.id = carts.id;
    this.buyerId = carts.userId;
    this.quantity = carts.quantity;
    this.createdAt = carts.createdAt.toISOString();
    this.updatedAt = carts.updatedAt.toISOString();
    this.items = carts.cartItems.map(
      (cartItem) => new getCartItemDTO(cartItem)
    );
  }
}
