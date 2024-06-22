// services.ts
'use client';

export async function fetchProducts(filters: any = {}) {
  const token = localStorage.getItem('jwt');
  const queryParams = new URLSearchParams();

  console.log('FILTERS AT FUN==-> ', filters);
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(
    `${process.env.SERVER_URL}/${process.env.API_VERSION}/product/search?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${token}`,
      },
    }
  );

  // console.log(response)
  // if(response.status == 404) return []

  // if (!response.ok) {
  //   throw new Error('Failed to fetch products');
  // }

  return response.json();
}

export async function createProduct(data: object) {
  const token = localStorage.getItem('jwt');
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/product/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   throw new Error('Failed to create product');
  // }

  return response.json();
}

export async function createVariant(data: object) {
  const token = localStorage.getItem('jwt');
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/variant/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   throw new Error('Failed to add Variant');
  // }

  return response.json();
}

export async function fetchProductById(productId: string) {
  const token = localStorage.getItem('jwt');
  const response = await fetch(
    `${process.env.SERVER_URL}/${process.env.API_VERSION}/product/search?productId=${productId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${token}`,
      },
    }
  );

  // if (!response.ok) {
  //   throw new Error('Failed to fetch product');
  // }

  return response.json();
}

export async function updateProduct(productId: string, data: object) {
  const token = localStorage.getItem('jwt');
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/product/edit/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
    body: JSON.stringify({ ...data }),
  });

  // if (!response.ok) {
  //   throw new Error('Failed to update product');
  // }

  return response.json();
}

export async function updateVariant(variantId: string, data: object) {
  const token = localStorage.getItem('jwt');
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/variant/edit/${variantId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
    body: JSON.stringify({ ...data }),
  });

  // if (!response.ok) {
  //   throw new Error('Failed to update variant');
  // }

  return response.json();
}

export async function deleteProduct(productId: string) {
  const token = localStorage.getItem('jwt');
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/product/remove/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
  });
  if (!response.ok) return false;

  // if (!response.ok) {
  //   throw new Error('Failed to delete Product');
  // }

  return true;
}

export async function delVariant(variantId: string) {
  const token = localStorage.getItem('jwt');
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/variant/remove/${variantId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
  });

  // if (!response.ok) {
  //   throw new Error('Failed to delete Variant');
  // }

  return true;
}
