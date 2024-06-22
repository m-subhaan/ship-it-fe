import type { Category, SubCategory } from '@/types/category';

export async function fetchCategories() {
  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${process.env.SERVER_URL}/${process.env.API_VERSION}/category/search?isSubCategory=true`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${token}`,
      },
    }
  );

  if (!response.ok) {
    return [];
    // throw new Error('Failed to fetch Categories');
  }

  return response.json();
}

export async function createNewCategory({ categoryName, subCategory }: Category) {
  const token = localStorage.getItem('jwt');

  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/category/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
    body: JSON.stringify({ categoryName, subCategoryName: subCategory.map((x) => x.subCategoryName) }),
  });

  if (!response.ok) {
    throw new Error('Failed to create Category');
  }

  return response.json();
}

export async function bulkUpsertSubCategories({ categoryId, subCategory }: Category) {
  const token = localStorage.getItem('jwt');

  subCategory.forEach((x) => delete x.categoryId);
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/subCategory/bulkUpsert`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
    body: JSON.stringify({ categoryId, upsert: subCategory }),
  });

  if (!response.ok) {
    throw new Error('Failed to update SubCategories');
  }

  return response.json();
}

export async function updateCategoryName(categoryId: any, categoryName: string) {
  const token = localStorage.getItem('jwt');

  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/category/edit/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
    body: JSON.stringify({ categoryName }),
  });

  // if (!response.ok) {
  //   throw new Error('Failed to update Category');
  // }

  return response.json();
}

export async function deleteCategory(categoryId: any) {
  const token = localStorage.getItem('jwt');

  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/category/remove/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete Category');
  }
}
export async function deleteSubCategories(categoryId: string) {
  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${process.env.SERVER_URL}/${process.env.API_VERSION}/subCategory/remove/${categoryId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete subCategory');
  }
}
