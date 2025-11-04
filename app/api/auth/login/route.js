    // app/api/auth/login/route.js
    import { NextResponse } from 'next/server';
    import { connectToDatabase } from '@/lib/mongodb'; // Предполагаем, что у вас есть эта функция
    import User from '@/models/user'; // Предполагаем, что у вас есть эта модель

    export async function POST(request) {
      try {
        await connectToDatabase();
        const payload = await request.json(); // Получаем весь payload
        const telegramUserData = payload; // Предполагаем, что Telegram данные там
        const { role } = payload; // Получаем роль

        // --- Ваша логика аутентификации/регистрации ---
        let user = await User.findOne({ telegramId: telegramUserData.id });

        if (!user) {
          user = new User({
            telegramId: telegramUserData.id,
            username: telegramUserData.username || telegramUserData.first_name,
            firstName: telegramUserData.first_name,
            lastName: telegramUserData.last_name,
            role: role || 'user', // Устанавливаем роль, если она передана, иначе 'user'
          });
          await user.save();
        } else {
          // Если пользователь уже существует, обновляем роль, если это разрешено
          if (role === 'admin' && user.role !== 'admin') {
             user.role = 'admin';
             await user.save();
          }
        }

        const responseUser = {
          id: user._id,
          telegramId: user.telegramId,
          username: user.username,
          firstName: user.firstName,
          role: user.role,
        };

        return NextResponse.json(responseUser);

      } catch (error) {
        console.error('Ошибка при логине пользователя:', error);
        return NextResponse.json({ message: 'Ошибка сервера при авторизации' }, { status: 500 });
      }
    }
