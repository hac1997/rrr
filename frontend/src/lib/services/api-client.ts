// lib/services/api-client.ts
'use server';

import { getAuthToken, refreshAccessToken, logout } from './auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface ApiRequestOptions<TBody = unknown> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: TBody;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    requireAuth = true,
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (requireAuth) {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store', // Desabilita cache para dados dinâmicos
    });

    // Se o token expirou (401), tenta renovar
    if (response.status === 401 && requireAuth) {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Tenta novamente com o novo token
        requestHeaders['Authorization'] = `Bearer ${newToken}`;
        
        const retryResponse = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          cache: 'no-store',
        });

        if (!retryResponse.ok) {
          throw new Error(`Erro ${retryResponse.status}: ${retryResponse.statusText}`);
        }

        return await retryResponse.json();
      } else {
        // Não conseguiu renovar, força logout
        await logout();
        throw new Error('Sessão expirada. Faça login novamente.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Erro ${response.status}: ${response.statusText}`
      );
    }

    // Se a resposta for vazia (204 No Content), retorna null
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro ao comunicar com o servidor');
  }
}

export async function apiGet<T>(endpoint: string, requireAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', requireAuth });
}

export async function apiPost<T, TBody = unknown>(
  endpoint: string,
  body: TBody,
  requireAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body, requireAuth });
}

export async function apiPut<T, TBody = unknown>(
  endpoint: string,
  body: TBody,
  requireAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PUT', body, requireAuth });
}

export async function apiPatch<T, TBody = unknown>(
  endpoint: string,
  body: TBody,
  requireAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PATCH', body, requireAuth });
}

export async function apiDelete<T>(endpoint: string, requireAuth = true): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE', requireAuth });
}

