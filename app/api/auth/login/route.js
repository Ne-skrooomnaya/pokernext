// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

export async function POST(req) {
  try {
    await dbConnect();
    const { telegramId } = await req.json();

    if (!telegramId) {
      return NextResponse.json({ success: false, message: 'Telegram ID is required' }, { status: 400 });
    }

    const user = await User.findOne({ telegramId: telegramId });

    if (user) {
      // Пользователь найден, можно было бы здесь генерировать JWT,
      // но пока просто возвращаем успех, чтобы фронтенд перенаправил.
      // В продакшене рекомендуется вернуть JWT и сохранить его в cookie.
      return NextResponse.json({ success: true, user: { id: user._id, telegramId: user.telegramId } }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
