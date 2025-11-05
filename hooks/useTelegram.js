// hooks/useTelegram.js
import { useEffect, useState } from 'react';
import { init, parseInitData, useInitData } from '@twa-dev/sdk'; // Импортируем нужные функции

const useTelegram = () => {
  const [user, setUser] = useState(null);
  const [tg, setTg] = useState(null); // Состояние для самого SDK

  useEffect(() => {
    const initializeTelegram = async () => {
      try {
        await init(); // Инициализируем SDK
        const tgInstance = window.Telegram.WebApp; // Получаем экземпляр WebApp
        setTg(tgInstance); // Сохраняем экземпляр

        if (tgInstance.initData) {
          const initData = parseInitData(tgInstance.initData); // Парсим данные
          setUser(initData.user); // Получаем данные пользователя
          console.log('Telegram User:', initData.user);
        } else {
          console.warn('No initData found. Ensure the app is opened via Telegram.');
        }
      } catch (error) {
        console.error('Error initializing Telegram SDK:', error);
      }
    };

    initializeTelegram();
  }, []);

  return { tg, user };
};

export default useTelegram;
