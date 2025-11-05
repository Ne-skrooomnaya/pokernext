// hooks/useTelegram.js (используйте этот вариант)
'use client'; // <--- ДОБАВЬТЕ ЭТУ СТРОКУ В САМОМ НАЧАЛЕ ФАЙЛА

import { useEffect, useState, createContext, useContext } from 'react';

// Функция для загрузки скрипта Telegram Web App
const loadTelegramWebAppSDK = () => {
  return new Promise((resolve, reject) => {
    const scriptId = 'telegram-web-app-sdk';
    if (document.getElementById(scriptId)) {
      // Если скрипт уже существует, просто возвращаем объект, если он доступен
      if (window.Telegram && window.Telegram.WebApp) {
        resolve(window.Telegram.WebApp);
      } else {
        // Если скрипт есть, но объект не инициализирован, это тоже ошибка
        reject(new Error('Telegram Web App SDK already exists but is not initialized correctly'));
      }
      return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true; // Загрузка асинхронно
    script.onload = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        resolve(window.Telegram.WebApp);
      } else {
        reject(new Error('Telegram Web App SDK loaded, but window.Telegram.WebApp is not available'));
      }
    };
    script.onerror = (err) => {
      console.error('Error loading script:', err);
      reject(new Error('Failed to load Telegram Web App SDK script'));
    };
    document.body.appendChild(script);
  });
};

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [tg, setTg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTelegramWebAppSDK()
      .then((tgInstance) => {
        tgInstance.ready();
        tgInstance.expand();
        setTg(tgInstance);
        setIsLoading(false);
        console.log('Telegram API available and initialized.');
      })
      .catch((err) => {
        console.error('Failed to initialize Telegram API:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const value = {
    tg,
    isLoading,
    error,
    // Добавьте сюда любые другие методы Telegram API, которые вам нужны
    // например, для кнопки выхода
    closeApp: () => {
      if (tg) {
        tg.close();
      } else {
        console.error("Telegram API not available to close the app.");
      }
    },
    // Если вам нужен initData для отправки на бэкенд
    getInitData: () => tg?.initData,
    // Если вам нужен initDataUnsafe (используйте с осторожностью!)
    getInitDataUnsafe: () => tg?.initDataUnsafe,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
