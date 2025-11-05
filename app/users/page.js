// app/users/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useTelegram from '@/hooks/useTelegram';

export default function UsersPage() {
  const router = useRouter();
  const { user: telegramUser } = useTelegram(); // Получаем данные пользователя из Telegram
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!telegramUser) {
        setLoading(false);
        return;
      }

      try {
        // Предполагается, что у вас есть API, который по telegramId или другому идентификатору
        // возвращает полные данные пользователя из вашей БД
        const response = await fetch('/api/auth/me', { // Используем ваш существующий API /me
          method: 'POST', // Или GET, если /me поддерживает GET
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ telegramId: telegramUser.id }), // Или другое поле, которое ожидает /api/auth/me
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUserData(data.user);
          } else {
            // Если API /me вернул ошибку или пользователя не нашел,
            // возможно, стоит перенаправить обратно на главную или показать сообщение
            console.error('Could not fetch user data:', data.message);
            router.push('/'); // Перенаправляем на главную
          }
        } else {
          console.error('Error fetching user data:', response.status, await response.text());
          router.push('/'); // Перенаправляем на главную в случае ошибки
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/'); // Перенаправляем на главную в случае ошибки
      } finally {
        setLoading(false);
      }
    };

    // Проверяем, авторизован ли пользователь через TWA SDK
    if (telegramUser) {
      fetchUserData();
    } else {
      // Если нет данных пользователя из TWA SDK, перенаправляем на главную
      // Это защитит от прямого доступа к странице, если приложение открыто не из Telegram
      router.push('/');
    }
  }, [telegramUser, router]); // Зависимость от telegramUser и router

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Загрузка данных пользователя...</p>
      </div>
    );
  }

  if (!userData) {
    // Это может произойти, если пользователь перенаправлен обратно на главную
    return null;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Главная страница пользователя</h1>
      <p>Добро пожаловать, {userData.firstName || 'Пользователь'}!</p>
      <p>Ваш Telegram ID: {userData.telegramId}</p>
      {/* Здесь будет основной контент для авторизованного пользователя */}
      <p>Это основная страница вашего приложения.</p>
    </div>
  );
}
