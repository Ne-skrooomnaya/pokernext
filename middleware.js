    // middleware.js (в корне папки app)
    import { NextResponse } from 'next/server';
    import { verifyToken } from './lib/jwt'; // Импортируем верификатор токена

    const protectedRoutes = ['/api/protected', '/api/game']; // Пример списка защищенных маршрутов

    export function middleware(request) {
      const { pathname } = request.nextUrl;

      // Проверяем, является ли текущий маршрут защищенным
      const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

      if (!isProtected) {
        // Если маршрут не защищен, пропускаем запрос дальше
        return NextResponse.next();
      }

      // Если маршрут защищен, пытаемся получить токен
      const token = request.headers.get('Authorization')?.split(' ')[1]; // Ожидаем "Bearer <token>"
      // Или, если вы используете localStorage на клиенте, но хотите проверять здесь:
      // const tokenFromCookie = request.cookies.get('authToken')?.value; // Если токен в куках
      // const tokenFromLocalStorage = request.headers.get('X-Auth-Token'); // Если клиент отправляет его в кастомном заголовке

      // Пример получения токена из заголовка Authorization
      if (!token) {
        // Если токена нет, возвращаем ошибку "Unauthorized"
        return NextResponse.json({ message: 'Authentication token is missing' }, { status: 401 });
      }

      // Верифицируем токен
      const decodedToken = verifyToken(token);

      if (!decodedToken) {
        // Если токен невалиден, возвращаем ошибку "Unauthorized"
        return NextResponse.json({ message: 'Invalid authentication token' }, { status: 401 });
      }

      // Если токен валиден, добавляем userId в заголовок запроса для использования в API
      request.headers.set('X-User-ID', decodedToken.userId);

      // Пропускаем запрос дальше к API Route
      return NextResponse.next();
    }

    export const config = {
      matcher: '/api/:path*', // Применяем middleware ко всем маршрутам в /api
    };
