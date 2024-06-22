import { type Admin } from '@/types/admin';

export async function fetchAdmins(token: string): Promise<Admin[]> {
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/admin/search`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch admins');
  }

  return response.json();
}

export async function addUser(token: string, user: Admin) {
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/admin/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error('Failed to add User');
  }
}

export async function editUser(token: string, user: Admin, userId: string) {
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/admin/edit/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error('Failed to add User');
  }
}

export async function deleteUser(token: string, userId: string) {
  const response = await fetch(`${process.env.SERVER_URL}/${process.env.API_VERSION}/admin/remove/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete User');
  }
}
