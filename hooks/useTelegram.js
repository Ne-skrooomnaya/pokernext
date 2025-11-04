// app/hooks/useTelegram.js (или lib/hooks/useTelegram.js)
'use client'; // Указываем, что это клиентский хук

import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const telegramWebAppRef = useRef(null); // Реф для хранения объекта Telegram.WebApp

  useEffect(() => {
    // Этот код выполняется только в браузере
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      telegramWebAppRef.current = tg; // Сохраняем объект в реф

      tg.ready();
      tg.expand();

      const initDataUnsafe = tg.initDataUnsafe;

      if (initDataUnsafe && initDataUnsafe.user) {
        setTelegramUser(initDataUnsafe.user);
        // Попытка авторизации при инициализации
        loginUser(initDataUnsafe.user);
      } else {
        // Если данных Telegram нет, но API Telegram доступен
        console.warn("Telegram Web App initDataUnsafe.user is not available.");
        setLoading(false); // Загрузка завершена, но без данных пользователя Telegram
      }
    } else {
      // Если window.Telegram.WebApp недоступен (не в Telegram, или ошибка инициализации)
      console.error("Telegram Web App API is not available.");
      setLoading(false); // Загрузка завершена, но без доступа к Telegram API
    }
  }, []); // Выполняется один раз при монтировании

  // Функция для логина пользователя через ваш API
  const loginUser = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login API error:', errorData);
        setUser(null);
        // Важно: если логин не удался, возможно, нужно остаться на странице логина
        // или показать сообщение об ошибке. Перенаправление на /rating здесь может быть преждевременным.
        if (router.pathname !== '/login' && router.pathname !== '/') { // Проверяем, не на странице логина ли мы
           router.push('/login'); // или '/app/page.js'
        }
      } else {
        const userDataFromBackend = await response.json();
        setUser(userDataFromBackend);
        // Перенаправляем на /rating только после успешного логина и получения данных от бэкенда
        router.push('/rating');
      }
    } catch (error) {
      console.error('Error during login process:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения текущего пользователя (проверка сессии)
  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setLoading(false);
        return data;
      } else if (response.status === 401) {
        setUser(null);
        setLoading(false);
        // Если пользователь не авторизован, перенаправляем на логин
        router.push('/login'); // или '/app/page.js'
      } else {
        console.error('Error fetching current user:', response.status, await response.text());
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setUser(null);
      setLoading(false);
    }
  };

  // Добавляем возможность вызывать методы Telegram.WebApp напрямую через хук
  const telegramApi = (method, ...args) => {
    if (telegramWebAppRef.current && typeof telegramWebAppRef.current[method] === 'function') {
      return telegramWebAppRef.current[method](...args);
    } else {
      console.warn(`Telegram Web App method '${method}' is not available or not a function.`);
      return undefined; // или null, в зависимости от ожидаемого возвращаемого значения
    }
  };

  const value = {
    user,
    loading,
    telegramUser,
    loginUser,
    fetchCurrentUser,
    telegramApi, // Функция для доступа к другим методам Telegram API
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};

const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (context === null) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

export default useTelegram;
