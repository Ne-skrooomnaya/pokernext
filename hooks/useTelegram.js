// app/hooks/useTelegram.js (или lib/hooks/useTelegram.js)
'use client'; // Указываем, что это клиентский хук

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation'; // Импортируем useRouter для App Router

// Создаем контекст для удобной передачи данных между компонентами
const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Пользователь, полученный от вашего бэкенда (после логина)
  const [telegramUser, setTelegramUser] = useState(null); // Данные пользователя из Telegram Web App (initDataUnsafe)
  const [loading, setLoading] = useState(true); // Индикатор загрузки
  const router = useRouter();

  useEffect(() => {
    // Этот код выполняется только в браузере
    if (typeof window !== 'undefined') {
      const tg = window.Telegram.WebApp;

      if (tg) {
        tg.ready(); // Сообщаем Telegram, что приложение готово к работе
        tg.expand(); // Расширяем окно приложения на весь экран (если нужно)

        const initDataUnsafe = tg.initDataUnsafe;

        if (initDataUnsafe && initDataUnsafe.user) {
          setTelegramUser(initDataUnsafe.user);
          // Сразу пытаемся авторизовать пользователя на бэкенде
          loginUser(initDataUnsafe.user);
        } else {
          // Если данных Telegram нет (например, приложение открыто не через Telegram),
          // считаем загрузку завершенной. Пользователь, возможно, увидит страницу логина.
          setLoading(false);
          console.warn("Telegram Web App initDataUnsafe.user is not available.");
        }
      } else {
        console.error("Telegram Web App API is not available. Are you running this in a Telegram Web App?");
        setLoading(false);
      }
    } else {
      // Если код выполняется на сервере (SSR), мы не можем получить доступ к Telegram API
      // Поэтому просто устанавливаем loading в false, чтобы не блокировать рендеринг
      setLoading(false);
    }
  }, []); // Пустой массив зависимостей гарантирует, что этот эффект выполнится один раз при монтировании компонента.

  // Функция для логина пользователя через ваш API
  const loginUser = async (userData) => {
    setLoading(true); // Начинаем загрузку
    try {
      const response = await fetch('/api/auth/login', { // Отправляем запрос на ваш Next.js API маршрут
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Отправляем данные пользователя из Telegram
      });

      if (!response.ok) {
        // Если ответ сервера не OK (например, 401 Unauthorized, 500 Internal Server Error)
        const errorData = await response.json();
        console.error('Login API error:', errorData);
        setUser(null); // Сбрасываем данные пользователя от бэкенда
        // Можно также перенаправить пользователя на страницу ошибки или логина, если он не был авторизован
        // router.push('/login'); // или /app/page.js
      } else {
        // Успешный ответ от сервера
        const userDataFromBackend = await response.json();
        setUser(userDataFromBackend); // Сохраняем данные пользователя, полученные от бэкенда
        router.push('/rating'); // Перенаправляем пользователя на страницу рейтинга после успешного логина
      }
    } catch (error) {
      // Обработка ошибок сети или других проблем при запросе
      console.error('Error during login process:', error);
      setUser(null); // Сбрасываем данные пользователя
    } finally {
      setLoading(false); // Загрузка завершена, независимо от результата
    }
  };

  // Функция для получения текущего пользователя (например, для проверки сессии)
  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me'); // Ваш API-маршрут для получения данных текущего пользователя
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setLoading(false);
        return data;
      } else if (response.status === 401) {
        // Если пользователь не авторизован
        setUser(null);
        setLoading(false);
        router.push('/login'); // Перенаправляем на страницу логина
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

  // Предоставляем значения в контекст
  const value = {
    user, // Данные пользователя от бэкенда
    loading, // Статус загрузки
    telegramUser, // Сырые данные пользователя из Telegram
    loginUser, // Функция для логина
    fetchCurrentUser, // Функция для получения текущего пользователя
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};

// Кастомный хук для использования контекста
const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (context === null) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

export default useTelegram;
