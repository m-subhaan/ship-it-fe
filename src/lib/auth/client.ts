'use client';

import type { User } from '@/types/user';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface ConfirmPasswordChangeParams {
  userId: string;
  password: string;
  confirmPassword: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('jwt', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;
    const signInEndpoint = `${process.env.SERVER_URL}/${process.env.API_VERSION}/auth/login`;
    const response = await fetch(signInEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const responseData = await response.json();
    // if (!response.ok) {
    //   return { error: responseData.error || 'Failed to sign in' };
    // }

    if (responseData.status !== 'success' || !responseData.token) {
      return { error: responseData?.message };
    }

    localStorage.setItem('jwt', responseData.token);
    localStorage.setItem('user', JSON.stringify(responseData.admin));

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: any | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('jwt');
    const user = localStorage.getItem('user');
    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');

    return {};
  }

  async confirmPasswordChange(params: ConfirmPasswordChangeParams): Promise<{ error?: string }> {
    const { userId, password, confirmPassword } = params;
    const endpoint = `${process.env.SERVER_URL}/${process.env.API_VERSION}/auth/resetPassword/${userId}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        confirmPassword,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to change password');
    }
    return {};
  }
}

export const authClient = new AuthClient();
