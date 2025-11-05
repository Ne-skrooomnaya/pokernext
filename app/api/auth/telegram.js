// pages/api/auth/telegram.js

import dbConnect from '../../../../lib/mongodb';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

// --- ВАЛИДАЦИЯ ДАННЫХ TELEGRAM ---
function validateTelegramInitData(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');
  params.sort();

  const dataCheckString = Array.from(params.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // 1. Создаем секретный ключ (key)
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest();

  // 2. Вычисляем HMAC
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // 3. Сравниваем
  return calculatedHash === hash;
}

// --- ОСНОВНОЙ API ХЕНДЛЕР ---
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ message: 'Missing initData' });
  }

  // 1. ВАЛИДАЦИЯ
  const isValid = validateTelegramInitData(initData);

  if (!isValid) {
    // Если данные подделаны или недействительны
    return res.status(401).json({ message: 'Invalid Telegram Init Data' });
  }

  // 2. ПАРСИНГ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
  const params = new URLSearchParams(initData);
  const userJson = params.get('user');

  if (!userJson) {
    return res.status(400).json({ message: 'User data not found in initData' });
  }

  const userData = JSON.parse(userJson);
  const telegramId = String(userData.id);

  await dbConnect();

  try {
    // 3. ПОИСК ИЛИ СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ
    let user = await User.findOneAndUpdate(
      { telegramId: telegramId },
      {
        // Обновляем данные на случай, если пользователь сменил имя
        username: userData.username || null,
        firstName: userData.first_name || 'User',
      },
      {
        new: true, // Вернуть обновленный документ
        upsert: true, // Создать, если не существует
        runValidators: true,
      }
    );

    // 4. ГЕНЕРАЦИЯ JWT
    const token = jwt.sign(
      { userId: user._id, telegramId: user.telegramId },
      JWT_SECRET,
      { expiresIn: '7d' } // Токен действует неделю
    );

    // 5. ОТВЕТ КЛИЕНТУ
    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        pokerRating: user.pokerRating,
      },
    });

  } catch (error) {
    console.error('Database or Auth Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
