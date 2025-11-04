// app/page.js
'use client';

import React, { useEffect } from 'react';
import useTelegram from '@/hooks/useTelegram'; // Путь к вашему хуку
import { useRouter } from 'next/navigation';

function HomePage() {
  const { user, loading, telegramUser, loginUser, telegramApi } = useTelegram();
  const router = useRouter();

  // Если пользователь уже авторизован (получены данные от бэкенда),
  // перенаправляем его на другую страницу.
  // На локалке, когда используется заглушка, user может стать null после рефреша,
  // поэтому делаем проверку на loading
  useEffect(() => {
    if (!loading && user) {
      router.push('/users');
    }
  }, [loading, user, router]);

  // Обработчик для кнопки "Войти как Пользователь"
  const handleLoginAsUser = async () => {
    if (telegramUser) {
      // Передаем роль 'user'
      await loginUser(telegramUser, 'user');
    } else {
      alert("Данные Telegram недоступны. Пожалуйста, перезапустите приложение.");
    }
  };

  // Обработчик для кнопки "Войти как Администратор"
  const handleLoginAsAdmin = async () => {
    if (telegramUser) {
      // Передаем роль 'admin'
      await loginUser(telegramUser, 'admin');
    } else {
      alert("Данные Telegram недоступны. Пожалуйста, перезапустите приложение.");
    }
  };

  // Отображаем кнопки, если не идет загрузка и нет авторизованного пользователя
  // на локалке, когда Telegram API недоступен.
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Добро пожаловать!</h1>
      {!user && !loading && (
        <>
          <p>Выберите тип входа:</p>
          <button
            onClick={handleLoginAsUser}
            style={{ padding: '15px 30px', fontSize: '18px', marginRight: '20px' }}
          >
            Войти как Пользователь
          </button>
          <button
            onClick={handleLoginAsAdmin}
            style={{ padding: '15px 30px', fontSize: '18px' }}
          >
            Войти как Администратор
          </button>
          {/* Кнопка для симуляции авторизации через Telegram (для тестирования) */}
          {/* Если вы хотите протестировать, как будет работать в Telegram,
              можно временно убрать `telegramUser` из `mockTelegramWebApp`
              и закомментить `if (tg === mockTelegramWebApp)` в хуке,
              чтобы логин происходил автоматически. */}
        </>
      )}
      {loading && <p>Загрузка...</p>}
    </div>
  );
}

export default HomePage;

