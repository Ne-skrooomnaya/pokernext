// app/page.js
'use client'; // Этот компонент будет клиентским

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Для навигации в App Router
// import useTelegram from '@/hooks/useTelegram'; // Предполагаем, что хук будет в app/hooks/

// --- Начало: Пример кастомного хука useTelegram ---
// Вам нужно будет создать этот хук и разместить его, например, в app/hooks/useTelegram.js
// Этот хук должен будет получить данные Telegram Web App и инициировать логин через API
function useTelegram() {
  const [user, setUser] = useState(null); // Пользователь, полученный от вашего бэкенда
  const [telegramUser, setTelegramUser] = useState(null); // Данные из Telegram Web App
  const [loading, setLoading] = useState(true); // Индикатор загрузки
  const router = useRouter();

  useEffect(() => {
    // Этот код выполняется только в браузере
    if (typeof window !== 'undefined') {
      const tg = window.Telegram.WebApp;

      if (tg) {
        tg.ready(); // Уведомляем Telegram, что приложение готово
        tg.expand(); // Растягиваем окно приложения

        const initDataUnsafe = tg.initDataUnsafe;
        if (initDataUnsafe && initDataUnsafe.user) {
          setTelegramUser(initDataUnsafe.user);
          // Попытка авторизации на бэкенде сразу при загрузке страницы
          loginUser(initDataUnsafe.user);
        } else {
          setLoading(false); // Если данных Telegram нет, загрузка завершена
        }
      } else {
        console.error("Telegram Web App API is not available.");
        setLoading(false);
      }
    }
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

  const loginUser = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Отправляем данные Telegram пользователем
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login API error:', errorData);
        setUser(null); // Сбрасываем пользователя в случае ошибки
      } else {
        const userDataFromBackend = await response.json();
        setUser(userDataFromBackend); // Сохраняем пользователя, полученного от бэкенда
        router.push('/rating'); // Перенаправляем после успешного логина
      }
    } catch (error) {
      console.error('Error during login:', error);
      setUser(null); // Сбрасываем пользователя в случае ошибки сети
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, telegramUser, loginUser };
}
// --- Конец: Пример кастомного хука useTelegram ---


export default function HomePage() {
  const { user, loading, telegramUser, loginUser } = useTelegram();
  const router = useRouter(); // Используем useRouter для навигации

  // Перенаправление, если пользователь уже авторизован (получены данные от бэкенда)
  useEffect(() => {
    if (!loading && user) {
      router.push('/rating'); // Перенаправляем на страницу рейтинга
    }
  }, [loading, user, router]);

  const handleLogin = async () => {
    if (telegramUser) {
      await loginUser(telegramUser);
      // Перенаправление произойдет в useEffect, когда user обновится
    } else {
      alert("Данные Telegram недоступны. Пожалуйста, перезапустите приложение.");
    }
  };

  // На главной странице входа отображаем только одну кнопку "Войти"
  // Если пользователь еще не авторизован (loading === false и user === null)
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Добро пожаловать!</h1>
      {!user && !loading && ( // Показываем кнопку, только если не загрузка и нет пользователя
        <button onClick={handleLogin} style={{ padding: '15px 30px', fontSize: '18px' }}>
          Войти
        </button>
      )}
      {/* Можно добавить индикатор загрузки, если логин еще идет */}
      {loading && <p>Загрузка...</p>}
    </div>
  );
}


