// pages/api/auth/telegram.js
import { WebAppUser } from '@twa-dev/sdk';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../lib/db'; // Создадим позже

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const user: WebAppUser = req.body.user; // Ожидаем user объект от фронтенда

    if (!user || !user.id) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    // Подключение к базе данных
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Проверяем, существует ли пользователь
    let existingUser = await usersCollection.findOne({ telegramId: user.id });

    if (!existingUser) {
      // Если пользователя нет, создаем его
      const newUser = {
        telegramId: user.id,
        username: user.username || null, // username может быть undefined
        firstName: user.first_name,
        lastName: user.last_name || null,
        avatarUrl: user.photo_url || null,
        createdAt: new Date(),
      };
      const result = await usersCollection.insertOne(newUser);
      existingUser = { ...newUser, _id: result.insertedId }; // Добавляем _id для удобства
    }

    // Генерация JWT токена
    const token = jwt.sign(
      { userId: existingUser._id, telegramId: user.id },
      JWT_SECRET,
      { expiresIn: '1d' } // Токен действителен 1 день
    );

    res.status(200).json({ token });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
