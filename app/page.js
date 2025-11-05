// pages/index.js (или в вашем компоненте для Mini App)
import React, { useEffect } from 'react';
import SDK, { WebAppUser } from '@twa-dev/sdk';
import axios from 'axios';

const HomePage = () => {
  useEffect(() => {
    SDK.ready(); // Сообщаем Telegram, что приложение готово

    const user: WebAppUser = SDK.initParams.user; // Получаем информацию о пользователе из параметров инициализации

    if (user) {
      console.log('User data from Telegram:', user);

      // Отправляем данные пользователя на бекенд для авторизации
      const authenticateUser = async () => {
        try {
          // Используем REACT_APP_API_URL из .env
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
          const response = await axios.post(`${apiUrl}/api/auth/telegram`, { user });

          if (response.data.token) {
            console.log('Authentication successful! Token received:', response.data.token);
            // Здесь вы можете сохранить токен (например, в localStorage или Cookie)
            // и перенаправить пользователя или показать контент приложения.
            localStorage.setItem('authToken', response.data.token);
            // Пример: redirect to dashboard
            // router.push('/dashboard');
          }
        } catch (error) {
          console.error('Authentication failed:', error);
          // Обработка ошибки авторизации
        }
      };

      authenticateUser();
    } else {
      console.error('No user data available from Telegram.');
      // Возможно, нужно показать сообщение об ошибке или перенаправить пользователя.
    }

    // Устанавливаем кнопки, если нужно
    SDK.MainButton.setText('Начать игру!');
    SDK.MainButton.show();
    SDK.MainButton.onClick(() => {
      alert('Начать игру!');
      // Действия при нажатии кнопки
    });

    // Очистка при размонтировании компонента
    return () => {
      SDK.MainButton.hide();
    };

  }, []);

  return (
    <div>
      <h1>Добро пожаловать в Модельный Покер!</h1>
      {/* Здесь будет основной контент вашего приложения */}
      <p>Идет авторизация...</p>
    </div>
  );
};

// Важно: Для использования process.env на клиенте, вам нужно префикс NEXT_PUBLIC_
// Измените ваш .env файл:
// REACT_APP_API_URL=https://poker-2uv1.onrender.com  -> NEXT_PUBLIC_API_URL=https://poker-2uv1.onrender.com
// Или, если вы используете App Router, настройте next.config.js

export default HomePage;
