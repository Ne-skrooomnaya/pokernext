// app/api/auth/telegram.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
// import { generateToken } from '@/lib/jwt'; // Если будете использовать JWT

export async function POST(req) {
  try {
    await dbConnect();
    const { telegramId, firstName, lastName, username } = await req.json();

    if (!telegramId) {
      return NextResponse.json({ success: false, message: 'Telegram ID is required' }, { status: 400 });
    }

    let user = await User.findOne({ telegramId: telegramId });

    if (!user) {
      // Пользователь не найден, создаем нового
      user = new User({
        telegramId,
        firstName,
        lastName,
        username,
        // Можете добавить другие поля, например, дату регистрации
        registeredAt: new Date(),
      });
      await user.save();
      console.log('New user created:', user);
    } else {
      // Пользователь найден, возможно, обновим его данные, если они изменились
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.username = username || user.username;
      await user.save();
      console.log('User updated:', user);
    }

    // В продакшене здесь нужно сгенерировать JWT токен
    // const token = generateToken({ id: user._id, telegramId: user.telegramId });

    // Пока что просто возвращаем успех, так как на фронтенде мы будем управлять состоянием авторизации
    return NextResponse.json({ success: true, message: 'User logged in successfully', user: { id: user._id, telegramId: user.telegramId } }, { status: 200 });

  } catch (error) {
    console.error('Telegram Auth API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
