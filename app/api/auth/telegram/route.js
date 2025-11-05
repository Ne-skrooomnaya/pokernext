// app/api/auth/telegram/route.js

import dbConnect from '../../../../lib/mongodb'; // Проверьте путь к lib/mongodb
import User from '../../../../models/User'; // Проверьте путь к models/User
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { NextResponse } from 'next/server'; // Важно для App Router

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

// ... (Оставьте функцию validateTelegramInitData без изменений) ...

export async function POST(request) {
  const { initData } = await request.json();

  if (!initData) {
    return NextResponse.json({ message: 'Missing initData' }, { status: 400 });
  }

  // 1. ВАЛИДАЦИЯ
  const isValid = validateTelegramInitData(initData);

  if (!isValid) {
    return NextResponse.json({ message: 'Invalid Telegram Init Data' }, { status: 401 });
  }

  // 2. ПАРСИНГ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
  // ... (логика парсинга userData и telegramId) ...

  await dbConnect();

  try {
    // 3. ПОИСК ИЛИ СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ
    // ... (логика findOneAndUpdate) ...

    // 4. ГЕНЕРАЦИЯ JWT
    // ... (логика jwt.sign) ...

    // 5. ОТВЕТ КЛИЕНТУ (Используем NextResponse)
    return NextResponse.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        pokerRating: user.pokerRating,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Database or Auth Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
