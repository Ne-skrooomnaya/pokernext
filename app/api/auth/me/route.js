// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

export async function POST(req) { // Меняем на POST, чтобы принимать telegramId
  try {
    await dbConnect();
    const { telegramId } = await req.json(); // Получаем telegramId из тела запроса

    if (!telegramId) {
      return NextResponse.json({ success: false, message: 'Telegram ID is required' }, { status: 400 });
    }

    const user = await User.findOne({ telegramId: telegramId }).select('-__v -password'); // Исключаем поля, которые не нужны

    if (user) {
      // Возвращаем данные пользователя из БД
      return NextResponse.json({ success: true, user: { id: user._id, telegramId: user.telegramId, firstName: user.firstName, lastName: user.lastName, username: user.username } }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'User not found in database' }, { status: 404 });
    }
  } catch (error) {
    console.error('Me API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
