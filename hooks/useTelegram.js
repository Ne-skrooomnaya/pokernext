import { useEffect, useState } from 'react';
// import { init, parseInitData } from '@twa-dev/sdk'; // Импортируем только необходимое

// Импорт может варьироваться в зависимости от вашей установки SDK.
// Если вы используете '@twa-dev/sdk', то init и parseInitData должны быть доступны.
// Если вы используете нативный Telegram Web App SDK, то init() может не существовать,
// а parseInitData может быть вашей собственной функцией или из другой библиотеки.
// Предполагаем, что вы используете '@twa-dev/sdk'
import SDK from '@twa-dev/sdk'; // Используем SDK как объект для доступа ко всем методам

const useTelegram = () => {
  const [user, setUser] = useState(null);
  const [tg, setTg] = useState(null); // Состояние для самого SDK

  useEffect(() => {
    const initializeTelegram = async () => {
      // Проверяем, что код выполняется в браузере и Telegram Web App SDK доступен
      if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        try {
          // Инициализация SDK. SDK.init() асинхронный.
          await SDK.init();

          const tgInstance = window.Telegram.WebApp; // Теперь window.Telegram.WebApp точно существует
          setTg(tgInstance); // Сохраняем экземпляр

          // Парсим initData, если он есть
          if (tgInstance.initData) {
            // Используем SDK.parseInitData, если импортировали SDK как объект
            const initData = SDK.parseInitData(tgInstance.initData);
            setUser(initData.user);
            console.log('Telegram User:', initData.user);
          } else {
            console.warn('No initData found. Ensure the app is opened via Telegram.');
          }

          // Убеждаемся, что Web App готов.
          // Telegram.WebApp.ready() должен быть вызван для сигнализации Telegram.
          tgInstance.ready();
          console.log('Telegram Web App SDK initialized and ready.');

        } catch (error) {
          console.error('Error initializing Telegram SDK:', error);
          // При ошибке инициализации, tg может остаться null, что обрабатывается дальше.
        }
      } else {
        // Если код выполняется не в браузере или Telegram Web App SDK не загружен
        console.warn('Telegram Web App SDK not available in this environment or not loaded.');
        // tg останется null, что является ожидаемым поведением в этой среде.
      }
    };

    initializeTelegram();
  }, []); // Пустой массив зависимостей: эффект выполняется один раз при монтировании.

  return { tg, user };
};

export default useTelegram;
