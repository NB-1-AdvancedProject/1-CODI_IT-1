import NotFoundError from "../lib/errors/NotFoundError";
import userRepository from "../repositories/userRepository";
import {
  postData,
  cartList,
  cartItemCount,
  getCart,
  patchData,
  CartItemSizes,
  deleteData,
  getIdCartItem,
  cartDataFind,
} from "../repositories/cartRepository";
import { CartData, CartList, CartItemData } from "../types/cartType";
import { cartDTO, cartListDTO, cartItemDTO } from "../lib/dto/cartDto";
import { cartBodyType } from "../structs/cartStructs";
import ForbiddenError from "../lib/errors/ForbiddenError";

export async function postCart(user: string): Promise<cartDTO> {
  const userData = await userRepository.findById(user);
  if (!userData) {
    throw new NotFoundError("user", user);
  }

  const quantity = 0;

  const cart = await postData(user);

  const result: CartData = {
    ...cart,
    quantity,
  };

  return new cartDTO(result);
}

export async function cartItemList(user: string): Promise<cartListDTO> {
  const userData = await userRepository.findById(user);
  if (!userData) {
    throw new NotFoundError("user", user);
  }

  const cartData = await cartList(user);

  if (!cartData) {
    throw new NotFoundError("cart", user);
  }

  const quantity = await cartItemCount(cartData.id);

  const result: CartList = {
    ...cartData,
    quantity,
  };

  return new cartListDTO(result);
}

export async function patchCart(
  user: string,
  cart: cartBodyType
): Promise<cartItemDTO> {
  const userData = await userRepository.findById(user);
  if (!userData) {
    throw new NotFoundError("user", user);
  }

  const cartData = await getCart(user);

  if (!cartData) {
    throw new NotFoundError("cart", user);
  }

  for (const size of cart.sizes) {
    await patchData(cartData.id, cart.productId, size.sizeId, size.quantity);
  }

  const updatedItem = await CartItemSizes(cartData.id, cart.productId);

  if (!updatedItem) {
    throw new NotFoundError("cartItem", user);
  }

  const quantity = await cartItemCount(cartData.id);

  const result: CartItemData = {
    ...updatedItem,
    cart: {
      ...updatedItem.cart,
      quantity: quantity,
    },
  };

  return new cartItemDTO(result);
}

export async function deleteCartItem(user: string, params: string) {
  const userData = await userRepository.findById(user);
  if (!userData) {
    throw new NotFoundError("user", user);
  }

  const cartData = await cartList(user);

  if (!cartData) {
    throw new NotFoundError("cart", user);
  }

  const cartItemData = await getIdCartItem(params);

  if (!cartItemData) {
    throw new NotFoundError("cartItem", params);
  }

  if (cartData.id !== cartItemData.cartId) {
    throw new ForbiddenError();
  }

  await deleteData(params);
}

export async function cartItemDetail(user: string, params: string) {
  const userData = await userRepository.findById(user);
  if (!userData) {
    throw new NotFoundError("user", user);
  }

  const cartData = await cartList(user);

  if (!cartData) {
    throw new NotFoundError("cart", user);
  }

  const cartDetail = await cartDataFind(params);

  if (!cartDetail) {
    throw new NotFoundError("cartItem", user);
  }

  if (cartData.id !== cartDetail.cartId) {
    throw new ForbiddenError();
  }

  const quantity = await cartItemCount(cartData.id);

  const result: CartItemData = {
    ...cartDetail,
    cart: {
      ...cartDetail.cart,
      quantity: quantity,
    },
  };

  return new cartItemDTO(result);
}
