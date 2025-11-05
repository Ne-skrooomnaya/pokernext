/* eslint-disable react-hooks/set-state-in-effect */
// app/page.js
'use client';

import React, { useEffect, useState } from 'react'; // Добавим useState
import useTelegram from '../hooks/useTelegram';

export default function HomePage() {
  const { tg, user } = useTelegram();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние для отслеживания успешного логина
  const [isLoading, setIsLoading] = useState(true); // Состояние для индикации загрузки

  useEffect(() => {
    // Этот useEffect выполняется только на клиенте
    if (user) {
      console.log('Telegram User Data:', user);
      setIsLoading(true); // Начинаем загрузку после получения данных пользователя

      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          console.log('User logged in, token received:', data.token);
          setIsLoggedIn(true); // Логин успешен
        } else {
          console.error('Login failed, no token received:', data);
          // Обработка ошибки логина
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        // Обработка сетевой ошибки
      })
      .finally(() => {
        setIsLoading(false); // Загрузка завершена (успешно или с ошибкой)
      });
    } else {
      // Если user всё ещё null (например, на этапе первоначальной загрузки или в браузере)
      setIsLoading(false); // Прекращаем показывать загрузку, если user не получен
    }
  }, [user, tg]); // Зависимость от user и tg

  // Пока user не определен (т.е. либо на сервере, либо еще не загрузился на клиенте)
  // или пока идет загрузка после получения user
  if (isLoading) {
    return <div>Loading Telegram user data...</div>;
  }

  // Если user определен и авторизация прошла успешно
  if (isLoggedIn) {
    return (
      <div>
        <h1>Welcome to the Poker App!</h1>
        <p>Hello, {user.first_name}!</p>
        {/* Основной контент вашего приложения */}
      </div>
    );
  }

  // Если user определен, но логин не удался (например, ошибка или нет токена)
  if (user && !isLoggedIn) {
    return (
      <div>
        <h1>Error</h1>
        <p>Failed to log in. Please try again.</p>
      </div>
    );
  }

  // Если user не определен (например, открыто не в Telegram Mini App)
  return (
    <div>
      <h1>Welcome to the Poker App!</h1>
      <p>Please open this app within Telegram to log in.</p>
    </div>
  );
}
