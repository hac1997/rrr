// lib/hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUser {
  id: number;
  email: string;
  userType: 'VOLUNTEER' | 'ORGANIZATION';
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Lê informações do usuário dos cookies (client-side)
    const getUserFromCookies = () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      if (cookies.user_id && cookies.user_email && cookies.user_type) {
        return {
          id: parseInt(cookies.user_id),
          email: decodeURIComponent(cookies.user_email),
          userType: cookies.user_type as 'VOLUNTEER' | 'ORGANIZATION',
        };
      }

      return null;
    };

    const userData = getUserFromCookies();
    setUser(userData);
    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      // Chama a action de logout que limpa os cookies no servidor
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Limpa cookies do client-side também
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isVolunteer: user?.userType === 'VOLUNTEER',
    isOrganization: user?.userType === 'ORGANIZATION',
    logout,
  };
}