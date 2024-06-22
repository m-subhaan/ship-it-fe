import { type Category, type SubCategory } from './category';

export interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface Variant {
  variantId: string;
  title: string;
  description: string;
  quantity: number;
  price: number;
  sku: string;
  imageUrls: string[];
  isPromotion: boolean;
  promotionValue: number;
  isPublish: boolean;
  optionName1: string;
  optionValue1: string;
  optionName2: string;
  optionValue2: string;
  optionName3: string;
  optionValue3: string;
  productId: string;
}

export interface Product {
  productId: string;
  title: string;
  description: string;
  brand: string;
  vendor: string;
  status: string;
  categoryId: string;
  subCategoryId: string;
  category: Category;
  subCategory: SubCategory;
  variant: Variant[];
  imageUrl: string;
}

export interface ProductsResponse {
  paginationInfo: PaginationInfo;
  rows: Product[];
}
