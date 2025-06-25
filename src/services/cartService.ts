import NotFoundError from "../lib/errors/NotFoundError";
import userRepository from "../repositories/userRepository";
import {
  postData,
  cartList,
  cartItemCount,
  getCart,
  patchData,
  CartItemSizes,
} from "../repositories/cartRepository";
import { CartData, CartList, CartItemData } from "../types/cartType";
import { cartDTO, cartListDTO, cartItemDTO } from "../lib/dto/cartDto";
import { cartBodyType } from "../structs/cartStructs";

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
