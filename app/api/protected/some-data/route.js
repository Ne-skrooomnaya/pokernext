        // app/api/protected/some-data/route.js
        import { NextResponse } from 'next/server';

        export async function GET(request) {
          // userId теперь доступен из заголовка, установленного middleware
          const userId = request.headers.get('X-User-ID');

          if (!userId) {
            // Этого не должно произойти, если middleware работает правильно, но для безопасности
            return NextResponse.json({ message: 'User ID not found' }, { status: 401 });
          }

          // Теперь вы можете использовать userId для доступа к данным пользователя из БД
          // Например: const user = await User.findById(userId);

          return NextResponse.json({ message: `Hello user ${userId}! This is protected data.` }, { status: 200 });
        }
