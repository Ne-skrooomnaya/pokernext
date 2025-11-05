// app/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useTelegram from '../hooks/useTelegram';

export default function HomePage() {
  const router = useRouter();
  const { user } = useTelegram();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/login', { // API для проверки пользователя
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ telegramId: user.id }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsLoggedIn(true);
            router.push('/users'); // Перенаправляем на страницу пользователя
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkAuth();
    } else {
      setLoading(false); // Если пользователя нет, тоже перестаем ждать
    }
  }, [user, router]); // Зависимость от user и router

  const handleLogin = async () => {
    if (!user) {
      alert('Не удалось получить данные Telegram. Откройте приложение через Telegram.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/telegram', { // API для регистрации/входа
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: user.id,
          firstName: user.first_name,
          lastName: user.last_name || '',
          username: user.username || '',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoggedIn(true);
        router.push('/users'); // Перенаправляем на страницу пользователя
      } else {
        alert(`Ошибка входа: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Произошла ошибка при попытке входа. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div >
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div >
      {!isLoggedIn && user && ( // Если не залогинен, но есть данные пользователя
        <>
          <h1>Добро пожаловать в Poker App!</h1>
          <p>Здравствуйте, {user.first_name}!</p>
          <button onClick={handleLogin} disabled={loading} >
            Войти
          </button>
        </>
      )}
      {!user && ( // Если нет данных пользователя
        <>
          <h1>Добро пожаловать в Poker App!</h1>
          <p>Пожалуйста, откройте приложение через Telegram.</p>
        </>
      )}
      {isLoggedIn && ( // Если залогинен (на всякий случай, если useEffect не сработал)
        <p>Вы уже авторизованы. Перенаправление...</p>
      )}
    </div>
  );
}
