// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const isAuthenticated = request.cookies.has('auth_token'); // Пример проверки токена

  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/admin')) {
    // Если пользователь не аутентифицирован и пытается зайти в админку
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Важно: Пропустите запрос дальше, если нет условий для блокировки
  return NextResponse.next();
}

export const config = {
  // Указываем, какие пути должны проходить через middleware
  matcher: ['/admin/:path*', '/profile/:path*'], // Пример
};
