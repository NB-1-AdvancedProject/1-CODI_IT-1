import {
  DetailProductResponseDTO,
  ProductListDTO,
  ProductListResponseDTO,
} from "../lib/dto/productDTO";
import { StocksReponseDTO } from "../lib/dto/stockDTO";
import NotFoundError from "../lib/errors/NotFoundError";
import productRepository from "../repositories/productRepository";
import {
  CreateProductBody,
  ProductListParams,
} from "../structs/productStructs";
import * as storeService from "../services/storeService";
import stockService from "./stockService";
import BadRequestError from "../lib/errors/BadRequestError";
import categoryService from "./categoryService";

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
  const product = await productRepository.create(newData);
  const stocks = await stockService.createStocks(data.stocks, product.id);
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
    stocks: new StocksReponseDTO(stocks).stocks,
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
      //위에있던 switch 문에서 searchBy가 store 기준으로 할경우 여기서 추가적인 검사필요.
      whereCondition.store = {};
    }
    whereCondition.store.likedBy = {
      some: {
        userId: params.favoriteStore,
      },
    };
  }

  const prismaParams = {
    skip: (params.page - 1) * params.pageSize,
    take: params.pageSize,
    where: whereCondition,
  };

  const products = await productRepository.findAllProducts(prismaParams);

  if (params.sort) {
    switch (params.sort) {
      case "mostReviewed": // 리뷰 많은 순
        products.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;

      case "highRating": // 별점 높은 순
        products.sort(
          (a, b) => (b.reviewsRating || 0) - (a.reviewsRating || 0)
        );
        break;

      case "HighPrice": // 높은 가격 순
        products.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "lowPrice": // 낮은 가격 순
        products.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "recent": // 등록일 순 (최신순)
        products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;

      case "salesRanking": // 판매순
        products.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      default: // 기본값은 그냥 최신순
        products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }
  }

  const productCount = await productRepository.findAllProductCount(
    prismaParams.where
  );

  return new ProductListResponseDTO(new ProductListDTO(products), productCount);
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

export default {
  createProduct,
  getProducts,
  deleteProduct,
};
