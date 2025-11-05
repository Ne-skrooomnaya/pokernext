       // app/page.js
    'use client'; // Этот компонент будет клиентским

    import React, { useEffect } from 'react';
    import useTelegram from '../hooks/useTelegram';

    export default function HomePage() {
      const { tg, user } = useTelegram();

      useEffect(() => {
        if (user) {
          // Отправляем telegramId на сервер для аутентификации/регистрации
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
              // Сохраняем токен в localStorage (или HttpOnly cookie для большей безопасности)
              localStorage.setItem('authToken', data.token);
              console.log('User logged in, token received:', data.token);
              // Теперь можете обновить состояние приложения, чтобы показать контент
              // или перенаправить пользователя.
            } else {
              console.error('Login failed, no token received:', data);
            }
          })
          .catch(error => {
            console.error('Error logging in:', error);
          });
        }
      }, [user, tg]); // Зависимость от user и tg

      if (!user) {
        return <div>Loading Telegram user data...</div>;
      }
      const authToken = localStorage.getItem('authToken');

        // Пример вызова защищенного API
        fetch('/api/protected/some-data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`, // Отправляем токен
            // 'X-Auth-Token': authToken // Альтернативный вариант, если middleware настроен иначе
          },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Protected data:', data);
        })
        .catch(error => {
          console.error('Error fetching protected data:', error);
        });
      return (
        <div>
          <h1>Welcome to the Poker App!</h1>
          <p>Your Telegram ID: {user.id}</p>
          <p>Username: {user.username || 'N/A'}</p>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>Добро пожаловать!</h1>
          {!user && !loading && (
            <button onClick={handleLogin} style={{ padding: '15px 30px', fontSize: '18px' }}>
              Войти
            </button>
          )}
          {loading && <p>Загрузка...</p>}
        </div>
        </div>
      );
    }

