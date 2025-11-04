// app/hooks/useTelegram.js (или lib/hooks/useTelegram.js)
'use client';

import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';

const TelegramContext = createContext(null);

// --- Заглушка для Telegram Web App API для локальной разработки ---
const mockTelegramWebApp = {
  ready: () => console.log('Mock TelegramWebApp: ready() called'),
  expand: () => console.log('Mock TelegramWebApp: expand() called'),
  initDataUnsafe: { // Пример данных пользователя Telegram
    user: {
      id: 123456789, // Пример Telegram ID
      is_premium: false,
      username: 'mock_user',
      first_name: 'Mock',
      last_name: 'User',
    },
  },
  // Добавьте другие методы, если они используются в приложении
};

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const telegramWebAppRef = useRef(null);

  useEffect(() => {
    let tg = null;

    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      tg = window.Telegram.WebApp;
      console.log('Telegram Web App API detected.');
    } else {
      // --- Заглушка для локальной разработки ---
      console.warn('Telegram Web App API not available. Using mock API.');
      tg = mockTelegramWebApp;
      // --- Конец заглушки ---
    }

    if (tg) {
      telegramWebAppRef.current = tg;
      tg.ready();
      tg.expand();

      // Используем try-catch на случай, если mockTelegramWebApp тоже может вызвать ошибку
      try {
        const initDataUnsafe = tg.initDataUnsafe;
        if (initDataUnsafe && initDataUnsafe.user) {
          setTelegramUser(initDataUnsafe.user);
          // Если мы на локалке и используем mock, не логинимся сразу,
          // иначе при каждом рефреше страницы будет новый логин.
          // Логин будет инициирован кнопкой.
          if (tg === mockTelegramWebApp) {
             setLoading(false); // Загрузка завершена, показываем кнопки логина
          } else {
             // В реальном Telegram, логинимся автоматически
             loginUser(initDataUnsafe.user);
          }
        } else {
          console.warn("Telegram Web App initDataUnsafe.user is not available.");
          setLoading(false);
        }
      } catch (error) {
        console.error('Error accessing Telegram Web App data:', error);
        setLoading(false);
      }
    } else {
      console.error("Telegram Web App API is not available, and mock API is also not functioning.");
      setLoading(false);
    }
  }, []); // Выполняется один раз при монтировании

  const loginUser = async (userData, role = 'user') => {
    setLoading(true);
    try {
      // На локалке, мы симулируем роль пользователя или админа
      const payload = {
        ...userData,
        role: role, // Добавляем роль в payload
      };

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login API error:', errorData);
        setUser(null);
        if (router.pathname !== '/login' && router.pathname !== '/') {
           // Если логин не удался, остаемся на странице и показываем кнопки
           // router.push('/login'); // или '/app/page.js'
        }
      } else {
        const userDataFromBackend = await response.json();
        setUser(userDataFromBackend);
        // Перенаправляем на /rating после успешного логина
        router.push('/users');
      }
    } catch (error) {
      console.error('Error during login process:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

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
        router.push('/'); // Перенаправляем на главную страницу, где будут кнопки логина
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

  const telegramApi = (method, ...args) => {
    if (telegramWebAppRef.current && typeof telegramWebAppRef.current[method] === 'function') {
      return telegramWebAppRef.current[method](...args);
    } else {
      console.warn(`Telegram Web App method '${method}' is not available or not a function.`);
      return undefined;
    }
  };

  const value = {
    user,
    loading,
    telegramUser,
    loginUser,
    fetchCurrentUser,
    telegramApi,
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