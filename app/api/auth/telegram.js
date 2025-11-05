// app/api/auth/telegram.js (проверка и возможные мелкие правки)
import { NextResponse } from 'next/server';
import SDK from '@twa-dev/sdk'; // Используй SDK как объект
import connectDB from '@/lib/mongodb'; // Путь к твоей функции подключения к БД
import User from '@/models/user'; // Путь к твоей модели пользователя
import { generateToken } from '@/lib/jwt'; // Путь к твоей функции генерации JWT

export async function POST(req) {
  try {
    // Получаем raw body, чтобы парсить initData
    const rawBody = await req.text();
    // Проверяем, есть ли initData вообще
    if (!rawBody) {
      return NextResponse.json({ message: "No initData provided." }, { status: 400 });
    }

    // Пытаемся парсить initData
    let initData;
    try {
      initData = SDK.parseInitData(rawBody); // Используем SDK.parseInitData
    } catch (parseError) {
      console.error("Error parsing initData:", parseError);
      return NextResponse.json({ message: "Invalid initData format." }, { status: 400 });
    }

    // Проверяем подлинность initData (если SDK поддерживает или ты делаешь это вручную)
    // SDK.validateInitData(rawBody) // Если такая функция есть в SDK
    // Или вручную:
    // const isValid = SDK.validate(initData.hash, process.env.BOT_TOKEN); // Требует BOT_TOKEN
    // if (!isValid) {
    //   return NextResponse.json({ message: "Invalid initData signature." }, { status: 400 });
    // }

    // Убедимся, что user есть в initData
    if (!initData.user) {
      return NextResponse.json({ message: "User data not found in initData." }, { status: 400 });
    }

    const { id: telegramId, username, first_name, last_name, photo_url } = initData.user;

    // Подключаемся к БД
    await connectDB();

    // Ищем пользователя по telegramId
    let user = await User.findOne({ telegramId: telegramId });

    if (!user) {
      // Если пользователя нет, создаем нового
      user = new User({
        telegramId: telegramId,
        username: username || '', // Используем пустую строку, если нет username
        firstName: first_name || '',
        lastName: last_name || '',
        photoUrl: photo_url || '',
        // Здесь можно добавить другие поля, если нужно
      });
      await user.save();
    } else {
      // Если пользователь есть, обновляем его данные (на случай изменений в Telegram)
      user.username = username || user.username; // Обновляем, если пришло новое значение
      user.firstName = first_name || user.firstName;
      user.lastName = last_name || user.lastName;
      user.photoUrl = photo_url || user.photoUrl;
      await user.save();
    }

    // Генерируем JWT токен для сессии
    const token = generateToken({ userId: user._id, telegramId: user.telegramId }); // Передаем userId и telegramId

    // Возвращаем токен и данные пользователя
    return NextResponse.json({
      message: 'Authentication successful',
      token,
      user: { // Возвращаем только нужные данные, избегая избыточности
        id: user._id, // Внутренний ID пользователя из БД
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error during Telegram authentication:", error);
    return NextResponse.json({ message: 'Internal server error during authentication.', error: error.message }, { status: 500 });
  }
}
