/* eslint-disable react-hooks/set-state-in-effect */
// hooks/useTelegram.js
import { useEffect, useState } from 'react';

const useTelegram = () => {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const TelegramWebApps = window.Telegram.WebApps;
    if (TelegramWebApps) {
      TelegramWebApps.ready(); // Сообщаем Telegram, что приложение готово
      setTg(TelegramWebApps);
      setUser(TelegramWebApps.initDataUnsafe.user);
    }
  }, []);

  return { tg, user };
};

export default useTelegram;
