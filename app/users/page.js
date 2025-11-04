// app/rating/page.js
'use client'; // Этот компонент будет клиентским

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const [userData, setUserData] = useState(null); // Данные текущего пользователя
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Пытаемся получить данные пользователя, если они еще не загружены
    // В реальном приложении, возможно, вам придется делать fetch на /api/auth/me
    // или использовать контекст, чтобы передать данные пользователя
    // Здесь мы предполагаем, что данные пользователя уже есть в хуке useTelegram
    // или мы их получаем каким-то другим способом.
    // Для примера, давайте сделаем fetch на API, который вернет текущего пользователя
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me'); // Создайте этот API-маршрут
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else if (response.status === 401) {
          // Если нет авторизации, перенаправляем на логин
          router.push('/login'); // или app/page.js, если логин там
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <div>Загрузка данных пользователя...</div>;
  }

  if (!userData) {
    // Если произошла ошибка или пользователь не найден, перенаправляем
    router.push('/login'); // или app/page.js
    return null; // Ничего не рендерим, пока идет перенаправление
  }

  return (
    <div>
      <h1>Рейтинг</h1>
      <p>Добро пожаловать, {userData.firstName || userData.username}!</p>
      {/* Здесь будет ваш список рейтинга */}
      <ul>
        <li>Игрок 1: 100 очков</li>
        <li>Игрок 2: 90 очков</li>
      </ul>
    </div>
  );
}
