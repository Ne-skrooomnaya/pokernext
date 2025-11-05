        // app/page.js
        'use client';

        import React, { useEffect } from 'react';
        import useTelegram from '../hooks/useTelegram';

        export default function HomePage() {
          const { tg, user } = useTelegram(); // Теперь tg и user должны быть определены

          useEffect(() => {
            if (user) { // Этот блок должен теперь выполниться
              console.log('Telegram User Data:', user); // Добавьте лог для проверки
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
                } else {
                  console.error('Login failed, no token received:', data);
                }
              })
              .catch(error => {
                console.error('Error logging in:', error);
              });
            } else {
              // Если user всё ещё null, возможно, есть другая проблема.
              // Но если Telegram Web App API доступен, user должен быть получен.
              console.log('Waiting for Telegram user data...');
            }
          }, [user, tg]);

          // Это сообщение теперь должно исчезнуть, когда user будет получен
          if (!user) {
            return <div>Loading Telegram user data...</div>;
          }

          // Если user получен, показываем что-то другое
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

