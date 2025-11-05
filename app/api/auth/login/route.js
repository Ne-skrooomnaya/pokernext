    // app/api/auth/login/route.js
    import { NextResponse } from 'next/server';
    import dbConnect from '../../../lib/mongodb'; // Путь к вашему файлу подключения к БД
    import User from '../../../../models/user'; // Путь к вашей модели пользователя

    export async function POST(request) {
      try {
        await dbConnect(); // Подключаемся к MongoDB

        const body = await request.json();
        const { telegramId, username, firstName, lastName } = body;

        if (!telegramId) {
          return NextResponse.json({ message: 'Telegram ID is required' }, { status: 400 });
        }

        // Ищем пользователя в базе данных
        let user = await User.findOne({ telegramId });

        if (user) {
          // Если пользователь существует, обновляем его данные (опционально)
          user.username = username || user.username;
          user.firstName = firstName || user.firstName;
          user.lastName = lastName || user.lastName;
          await user.save();
        } else {
          // Если пользователя нет, создаем нового
          user = await User.create({
            telegramId,
            username,
            firstName,
            lastName,
          });
        }

        // Здесь вы можете сгенерировать JWT токен или сессию,
        // чтобы аутентифицировать пользователя для последующих запросов.
        // Пока вернем данные пользователя.
        return NextResponse.json({ user }, { status: 200 });

      } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      }
    }
