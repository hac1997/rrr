// middleware.ts (na raiz do projeto)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const userType = request.cookies.get('user_type')?.value;
  const { pathname } = request.nextUrl;

  // Rotas públicas (não requerem autenticação)
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });

  // Se está tentando acessar rota pública e está autenticado, redireciona
  if (isPublicRoute && token) {
    if (userType === 'VOLUNTEER') {
      return NextResponse.redirect(new URL('/feed', request.url));
    } else if (userType === 'ORGANIZATION') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Se não está autenticado e tenta acessar rota protegida
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verifica se o tipo de usuário tem permissão para a rota
  if (token) {
    // Rotas de voluntário
    if (pathname.startsWith('/feed') && userType !== 'VOLUNTEER') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Rotas de organização
    if (pathname.startsWith('/dashboard') && userType !== 'ORGANIZATION') {
      return NextResponse.redirect(new URL('/feed', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};