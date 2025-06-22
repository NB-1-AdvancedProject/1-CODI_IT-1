import NotFoundError from "../lib/errors/NotFoundError";
import productRepository from "../repositories/productRepository";
import {
  CreateProductBody,
  PatchProductBody,
  ProductListParams,
} from "../structs/productStructs";
import * as storeService from "../services/storeService";
import stockService from "./stockService";
import BadRequestError from "../lib/errors/BadRequestError";
import categoryService from "./categoryService";
import prisma from "../lib/prisma";

async function createProduct(data: CreateProductBody, userId: string) {
  const store = await storeService.getStoreByUserId(userId);
  if (!store) {
    throw new NotFoundError("Store", userId);
  }
  const newData = {
    name: data.name,
    price: data.price,
    content: data.content,
    image: data.image,
    // discountPrice 스키마 생성시 수정할 예정
    // discountPrice: data.discountRate
    //   ? data.price * (100 - data.discountRate)
    //   : null,
    discountRate: data.discountRate || 0,
    discountStartTime: data.discountStartTime || null,
    discountEndTime: data.discountEndTime || null,
    category: {
      connectOrCreate: {
        where: { name: data.categoryName },
        create: { name: data.categoryName },
      },
    },
    store: { connect: { id: store.id } },
  };
  const { product, stocks } = await prisma.$transaction(async (tx) => {
    const product = await productRepository.createwithStocks(tx, newData);
    const stocks = await stockService.createStocksForProduct(
      tx,
      data.stocks,
      product.id
    );
    return { product, stocks };
  });

  return {
    ...product, //밑에있는 모든게 DetailedProductResponseDTO 로 처리필요
    storeId: product.store.id,
    storeName: product.store.name,
    reviewsRating:
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      (product.reviews.length || 1),
    reviewsCount: product.reviews.length,
    reviews: product.reviews,
    inquiries: product.inquiries,
    // discountPrice 스키마 생성시 수정할 예정
    discountPrice:
      Number(product.discountRate || 0) > 0
        ? Number(product.price) * (1 - Number(product.discountRate || 0) / 100)
        : Number(product.price),
    discountRate: product.discountRate || 0,
    discountStartTime: product.discountStartTime
      ? product.discountStartTime.toISOString()
      : null,
    discountEndTime: product.discountEndTime
      ? product.discountEndTime.toISOString()
      : null,
    stocks: stocks,
    category: [{ name: product.category.name, id: product.category.id }],
  };
}

async function getProducts(params: ProductListParams) {
  let whereCondition: any = {};
  switch (params.searchBy) {
    case "name":
      whereCondition = {
        name: {
          contains: params.search,
          mode: "insensitive",
        },
      };
      break;
    case "store":
      whereCondition = {
        store: {
          name: {
            contains: params.search,
            mode: "insensitive",
          },
        },
      };
      break;
    default:
      whereCondition = {
        name: {
          contains: params.search,
          mode: "insensitive",
        },
      };
  }

  if (params.categoryName) {
    const category = await categoryService.getCategoryByName(
      params.categoryName
    );
    if (category) {
      whereCondition.categoryId = category.id;
    }
  }

  if (params.priceMin || params.priceMax) {
    whereCondition.price = {};
    if (params.priceMin) {
      whereCondition.price.gte = params.priceMin;
    }
    if (params.priceMax) {
      whereCondition.price.lte = params.priceMax;
    }
  }

  if (params.size) {
    whereCondition.stocks = {
      some: {
        size: {
          size: {
            equals: params.size,
          },
        },
      },
    };
  }

  if (params.favoriteStore) {
    if (!whereCondition.store) {
      whereCondition.store = {};
    }
    whereCondition.store.likedBy = {
      some: {
        userId: params.favoriteStore,
      },
    };
  }

  // Prisma 정렬 조건 추가
  let orderBy: any = { createdAt: "desc" }; // 기본값

  if (params.sort) {
    switch (params.sort) {
      case "mostReviewed":
        orderBy = { reviewsCount: "desc" };
        break;
      case "highRating":
        orderBy = { reviewsRating: "desc" };
        break;
      case "HighPrice":
        orderBy = { price: "desc" };
        break;
      case "lowPrice":
        orderBy = { price: "asc" };
        break;
      case "recent":
        orderBy = { createdAt: "desc" };
        break;
      case "salesRanking":
        orderBy = { sales: "desc" };
        break;
    }
  }

  const prismaParams = {
    skip: (params.page - 1) * params.pageSize,
    take: params.pageSize,
    where: whereCondition,
    orderBy,
  };

  const products = await productRepository.findAllProducts(prismaParams);

  // 할인 상태 체크 및 업데이트
  const refreshedProducts = await Promise.all(
    products.map((product) =>
      checkAndUpdateDiscountState(product.discountEndTime, product.id)
    )
  );

  // 하나라도 갱신된 게 있다면 최신 데이터로 다시 조회
  const finalProducts = refreshedProducts.some((p) => p !== null)
    ? await productRepository.findAllProducts(prismaParams)
    : products;

  // storeName 붙이기
  const finalResult = await Promise.all(
    finalProducts.map(async (product) => {
      const store = await storeService.getStoreById(product.storeId);
      return {
        ...product,
        storeName: store!.name,
      };
    })
  );

  const productCount = await productRepository.findAllProductCount(
    prismaParams.where
  );

  return {
    list: finalResult,
    totalCount: productCount,
  };
}

async function getProduct(productId: string) {
  const product = await productRepository.findProductById(productId);
  if (!product) return null;
  const store = await storeService.getStoreById(product.storeId);
  const refreshedProduct = await checkAndUpdateDiscountState(
    product.discountEndTime,
    product.id
  );

  const finalProduct = refreshedProduct ?? product;

  return {
    ...finalProduct,
    storeName: store!.id,
  };
}

async function updateProduct(data: PatchProductBody, productId: string) {
  const newData = {
    name: data.name || undefined,
    price: data.price || undefined,
    content: data.content || undefined,
    image: data.image || undefined,
    discountRate: data.discountRate || undefined,
    discountStartTime: data.discountStartTime || undefined,
    discountEndTime: data.discountEndTime || undefined,
  };

  let updatedProduct = await prisma.$transaction(async (tx) => {
    if (data.stocks) {
      await stockService.updateStocksForProduct(data.stocks, productId);
    }
    return await productRepository.updateProductWithStocks(
      tx,
      newData,
      productId
    );
  });

  const refreshedProduct = await checkAndUpdateDiscountState(
    updatedProduct.discountEndTime,
    updatedProduct.id
  );

  return {
    ...updatedProduct,
    storeId: updatedProduct.store.id,
    storeName: updatedProduct.store.name,
    reviewsRating:
      updatedProduct.reviews.reduce((acc, review) => acc + review.rating, 0) /
      (updatedProduct.reviews.length || 1),
    reviewsCount: updatedProduct.reviews.length,
    reviews: updatedProduct.reviews,
    inquiries: updatedProduct.inquiries,
    // 스키마 변경 시 사용예정
    //discountPrice: refreshedProduct?.discountPrice ?? updatedProduct.discountPrice ?? updatedProduct.price;,
    discountRate:
      refreshedProduct?.discountRate ?? updatedProduct.discountRate ?? 0,
    discountStartTime:
      refreshedProduct?.discountStartTime ??
      updatedProduct.discountStartTime ??
      null,
    discountEndTime:
      refreshedProduct?.discountEndTime ??
      updatedProduct.discountEndTime ??
      null,
    stocks: updatedProduct.stocks,
    category: [
      { name: updatedProduct.category.name, id: updatedProduct.category.id },
    ],
  };
}

async function deleteProduct(productId: string, userId: string) {
  const store = await storeService.getStoreByUserId(userId);
  if (!store) {
    throw new NotFoundError("Store", userId);
  }
  const product = await productRepository.findProductById(productId);
  if (!product) {
    throw new NotFoundError("Product", productId);
  }
  if (product.storeId !== store.id) {
    throw new BadRequestError("Product does not belong to your store");
  }
  await productRepository.deleteById(productId);
}

async function getSellerIdByProductId(productId: string) {
  const product = await getProduct(productId);
  if (!product) {
    throw new NotFoundError("product", productId);
  }
  const store = await storeService.getStoreById(product.storeId!);
  if (!store) {
    throw new NotFoundError("store", product.storeId!);
  }
  return store.userId;
}

async function checkAndUpdateDiscountState(
  discountEndTime: Date | null,
  productId: string
) {
  if (discountEndTime && discountEndTime < new Date()) {
    // 할인 만료 → 상태 초기화 후 최신 product 리턴
    return await productRepository.update(
      {
        discountRate: undefined,
        discountStartTime: undefined,
        discountEndTime: undefined,
      },
      productId
    );
  }

  return null;
}

export default {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSellerIdByProductId,
  checkAndUpdateDiscountState,
};
