// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb'; // Предполагаем, что у вас есть эта функция
import User from '@/models/user'; // Предполагаем, что у вас есть эта модель

export async function POST(request) {
  try {
    await connectToDatabase();
    const telegramUserData = await request.json(); // Получаем данные от Telegram

    // --- Ваша логика аутентификации/регистрации ---
    // 1. Найдите пользователя по telegramId
    let user = await User.findOne({ telegramId: telegramUserData.id });

    // 2. Если пользователя нет, создайте нового
    if (!user) {
      user = new User({
        telegramId: telegramUserData.id,
        username: telegramUserData.username || telegramUserData.first_name, // Используем username или first_name
        firstName: telegramUserData.first_name,
        lastName: telegramUserData.last_name,
        // Добавьте другие поля, которые вы хотите сохранить
      });
      await user.save();
    }

    // 3. Возвращаем данные пользователя (например, его ID, имя, или информацию для сессии/токена)
    // Важно: не возвращайте пароль или другую чувствительную информацию
    const responseUser = {
      id: user._id, // MongoDB ID
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      // Другие поля, которые вы хотите передать на фронтенд
    };

    // Тут вы можете установить cookie для сессии, если нужно
    // const response = NextResponse.json(responseUser);
    // response.cookies.set('session_token', 'your_generated_token', { httpOnly: true });
    // return response;

    return NextResponse.json(responseUser); // Возвращаем данные пользователя

  } catch (error) {
    console.error('Ошибка при логине пользователя:', error);
    return NextResponse.json({ message: 'Ошибка сервера при авторизации' }, { status: 500 });
  }
}
