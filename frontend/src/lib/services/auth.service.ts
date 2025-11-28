// lib/services/auth.service.ts
'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface LoginResponse {
  token: string;
  refreshToken: string;
  email: string;
  userType: 'VOLUNTEER' | 'ORGANIZATION';
  userId: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Falha na autenticação');
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Erro ao conectar com o servidor');
  }
}

export async function setAuthCookies(loginResponse: LoginResponse): Promise<void> {
  const cookieStore = await cookies();
  
  // Token principal (24h)
  cookieStore.set('auth_token', loginResponse.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 horas
    path: '/',
  });

  // Refresh token (7 dias)
  cookieStore.set('refresh_token', loginResponse.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  });

  // Informações do usuário (não sensíveis)
  cookieStore.set('user_type', loginResponse.userType, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  cookieStore.set('user_id', loginResponse.userId.toString(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  cookieStore.set('user_email', loginResponse.email, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  return token?.value || null;
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/users/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      await clearAuthCookies();
      return null;
    }

    const data = await response.json();
    
    // Atualiza apenas o token de acesso
    cookieStore.set('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return data.token;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return null;
  }
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  cookieStore.delete('refresh_token');
  cookieStore.delete('user_type');
  cookieStore.delete('user_id');
  cookieStore.delete('user_email');
}

export async function logout(): Promise<void> {
  await clearAuthCookies();
}

export async function getUserType(): Promise<'VOLUNTEER' | 'ORGANIZATION' | null> {
  const cookieStore = await cookies();
  const userType = cookieStore.get('user_type')?.value;
  return (userType as 'VOLUNTEER' | 'ORGANIZATION') || null;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return !!token;
}