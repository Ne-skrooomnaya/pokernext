// Пример файла API роутов, например, 'pages/api/auth/telegram.js' в Next.js,
// или отдельного файла маршрутизации в Express.

// Предполагается, что у вас есть модуль для работы с БД (например, Prisma, Sequelize)
import connectToDatabase from '../../../lib/mongodb'; // Пример импорта

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Получите токен из переменных окружения

// Функция для верификации initData (примерная реализация)
function verifyTelegramInitData(initData, botToken) {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    const secret = crypto.createHash('sha256').update(botToken).digest();
    const data = Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([key, value]) => `${key}=${value}`).join('\n');
    const expectedHash = crypto.createHmac('sha256', secret).update(data).digest('hex');

    return hash === expectedHash;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { initData } = req.body;

    if (!initData) {
      return res.status(400).json({ message: 'initData is required' });
    }

    // --- БЕЗОПАСНОСТЬ: Проверка подлинности initData ---
    const isValid = verifyTelegramInitData(initData, BOT_TOKEN);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid Telegram data' });
    }
    // --- В реальном приложении обязательно используйте верификацию! ---

    try {
      const params = new URLSearchParams(initData);
      const userId = params.get('user')?.split(' ')[0]; // Пример извлечения ID пользователя
      const userFromTelegram = JSON.parse(params.get('user')); // Получаем полный объект user

      if (!userFromTelegram || !userFromTelegram.id) {
        return res.status(400).json({ message: 'Invalid user data in initData' });
      }

      const telegramId = userFromTelegram.id;
      const firstName = userFromTelegram.first_name;
      const username = userFromTelegram.username;

      // --- Работа с БД ---
      // 1. Поиск пользователя в БД по telegramId
      let user = await connectToDatabase.user.findUnique({
        where: { telegramId: telegramId.toString() }, // Убедитесь, что тип данных совпадает
      });

      // 2. Если пользователя нет, создаем нового
      if (!user) {
        user = await connectToDatabase.user.create({
          data: {
            telegramId: telegramId.toString(),
            firstName: firstName,
            username: username || null, // username может быть null
            // Другие поля, которые вы хотите сохранить
          },
        });
      }

      // 3. Возвращаем информацию о пользователе (или токен сессии, если используете)
      // В данном примере возвращаем просто данные пользователя
      res.status(200).json({
        id: user.id, // ID из вашей БД
        telegramId: user.telegramId,
        firstName: user.firstName,
        username: user.username,
        // ... другая информация
      });

    } catch (error) {
      console.error('Error during Telegram authentication:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
