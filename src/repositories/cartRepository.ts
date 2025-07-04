import prisma from "../lib/prisma";
import { cartBodyType } from "../structs/cartStructs";

export async function postData(user: string) {
  return prisma.cart.create({
    data: {
      userId: user,
    },
  });
}

export async function cartItemCount(cartId: string) {
  return prisma.cartItem.count({
    where: { cartId: cartId },
  });
}

export async function cartList(user: string) {
  return prisma.cart.findUnique({
    where: { userId: user },
    include: {
      cartItems: {
        include: {
          product: {
            include: { store: true, stocks: { include: { size: true } } },
          },
          cart: true,
        },
      },
    },
  });
}

export async function patchData(
  cartId: string,
  productId: string,
  sizeId: string,
  quantity: number
) {
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId,
      productId,
      sizeId,
    },
  });

  if (existingItem) {
    return prisma.cartItem.updateMany({
      where: { id: existingItem.id },
      data: { quantity },
    });
  } else {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        sizeId,
        quantity,
      },
    });
  }
}

export async function getCart(user: string) {
  return prisma.cart.findUnique({
    where: { userId: user },
  });
}

export async function CartItemSizes(cartId: string, productId: string) {
  return await prisma.cartItem.findFirst({
    where: {
      cartId,
      productId,
    },
    include: {
      product: {
        include: {
          store: true,
          stocks: {
            include: {
              size: true,
            },
          },
        },
      },
      cart: true,
    },
  });
}

export async function cartDataFind(params: string) {
  return await prisma.cartItem.findUnique({
    where: { id: params },
    include: {
      product: {
        include: {
          store: true,
          stocks: {
            include: {
              size: true,
            },
          },
        },
      },
      cart: true,
    },
  });
}

export async function deleteData(params: string): Promise<void> {
  await prisma.cartItem.delete({
    where: { id: params },
  });
}

export async function getIdCartItem(params: string) {
  return prisma.cartItem.findUnique({
    where: { id: params },
  });
}

export async function getItem(productId: string) {
  return prisma.cartItem.findMany({
    where: { id: productId },
    include: {
      cart: true,
    },
  });
}
