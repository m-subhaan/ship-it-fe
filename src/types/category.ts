export interface Category {
  categoryId?: string;
  categoryName: string;
  subCategory: SubCategory[];
}
// also add the type in the utils/constants in USERS constants
export interface SubCategory {
  subCategoryId?: string;
  subCategoryName: string;
  categoryId?: string;
}
