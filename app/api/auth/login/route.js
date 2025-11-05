// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { generateToken } from '../../../lib/jwt';
import crypto from 'crypto'; // Встроенный модуль Node.js для криптографии

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request) {
  try {
    // --- Валидация Telegram Web App ---
    const telegramInitData = request.headers.get('Web-App-Verify-Data');

    if (!BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN is not defined.');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }
    if (!telegramInitData) {
      return NextResponse.json({ message: 'Telegram Web App data is missing' }, { status: 400 });
    }

    // 1. Парсим initData
    // initData - это строка вида "query_id=...&user=...&auth_date=...&hash=..."
    const queryParams = new URLSearchParams(telegramInitData);
    const initData = Object.fromEntries(queryParams.entries());

    // 2. Валидация подписи
    // Telegram генерирует подпись (hash) из всех полей initData, кроме самого hash,
    // конкатенированных через '\n' и подписанных с помощью HMAC-SHA256,
    // используя токен бота как секретный ключ.
    const { hash, ...data } = initData; // Извлекаем hash и остальные данные
    const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest(); // Хэшируем токен бота
    const expectedHash = crypto.createHmac('sha256', secret).update(
      Object.keys(data).map(key => `${key}=${data[key]}`).join('\n')
    ).digest('hex');

    if (hash !== expectedHash) {
      console.error('Invalid Telegram Web App data hash.');
      return NextResponse.json({ message: 'Invalid Telegram Web App data' }, { status: 401 });
    }

    // Если хеш совпал, данные валидны.
    // Извлекаем ID пользователя и другую информацию
    const telegramUserId = parseInt(data.id, 10); // ID пользователя, парсим как число
    const username = data.username || null;
    const firstName = data.first_name || null;
    const lastName = data.last_name || null;
    // --- Конец валидации ---

    await dbConnect();

    let user = await User.findOne({ telegramId: telegramUserId });

    if (user) {
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      await user.save();
    } else {
      user = await User.create({
        telegramId: telegramUserId,
        username,
        firstName,
        lastName,
      });
    }

    const token = generateToken(user._id.toString());

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
