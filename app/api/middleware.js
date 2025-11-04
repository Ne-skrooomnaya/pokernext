    // pages/api/middleware.js
    import Cors from 'cors';
    import dbConnect from '../../lib/mongodb'; // Путь к файлу подключения

    // Инициализация CORS
    const cors = Cors({
      origin: process.env.CLIENT_URL || '*', // Используем переменную окружения
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
      credentials: true, // Если используешь куки/аутентификацию
    });

    // Вспомогательная функция для запуска middleware
    function runMiddleware(req, res, fn) {
      return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
          if (result instanceof Error) {
            return reject(result);
          }
          return resolve(result);
        });
      });
    }

    export { cors, runMiddleware, dbConnect };
    
