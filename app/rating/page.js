// app/rating/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RatingPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // Проверяем роль: если админ, перенаправляем на /admin
          if (data.role === 'admin') {
            router.push('/admin'); // Перенаправляем на админ-панель
          }
        } else if (response.status === 401) {
          // Если пользователь не авторизован, перенаправляем на главную
          router.push('/');
        } else {
          // Обработка других ошибок от API
          console.error('Error fetching current user:', response.status, await response.text());
          router.push('/'); // Перенаправляем на главную в случае ошибки
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        router.push('/'); // Перенаправляем на главную в случае ошибки сети
      } finally {
        setLoading(false);
      }
    };

    // Вызываем fetchUser только если загрузка еще не завершена
    // и если мы не находимся в состоянии, когда нужно перенаправить
    if (!loading) {
        // Если уже не загружается, но userData не получен (например, была ошибка)
        // то перенаправляем. Но это условие лучше проверять ПОСЛЕ fetchUser
        // Поэтому, просто вызываем fetchUser.
    }
    fetchUser();

  }, [router]); // Зависимость router важна, чтобы useEffect перевыполнялся при изменении роутера (что маловероятно, но безопасно)

  // --- Важно ---
  // Сейчас мы перенаправляем в useEffect.
  // ЕслиuserData все еще null после завершения fetchUser (из-за ошибки или 401),
  // то useEffect уже перенаправит.
  // Поэтому, блок ниже с проверкой userData и router.push('/')
  // после завершения useEffect становится избыточным или может вызвать ошибку.

  // Убираем эту проверку, так как она может выполняться во время рендеринга,
  // когда router еще не готов к push, или уже была выполнена в useEffect.
  // if (loading) {
  //   return <div>Загрузка данных пользователя...</div>;
  // }
  // if (!userData) {
  //   router.push('/');
  //   return null;
  // }

  // Показываем индикатор загрузки, пока данные не получены
  if (loading) {
    return <div>Загрузка данных пользователя...</div>;
  }

  // Если после загрузки userData все еще null (например, был 401 и перенаправили,
  // или произошла ошибка), то уже нет смысла рендерить что-то.
  // Хотя, перенаправление в useEffect уже должно было произойти.
  // На всякий случай, если вдруг все же попали сюда без userData:
  if (!userData) {
      // Эта ситуация не должна произойти, если useEffect работает корректно.
      // Если происходит, значит, useEffect не сработал или была другая проблема.
      return null; // Ничего не рендерим, если нет данных
  }


  // Если все успешно, рендерим содержимое страницы рейтинга
  return (
    <div>
      <h1>Рейтинг</h1>
      <p>Добро пожаловать, {userData.firstName || userData.username}!</p>
      {/* Ваш список рейтинга */}
      <ul>
        <li>Игрок 1: 100 очков</li>
        <li>Игрок 2: 90 очков</li>
      </ul>
    </div>
  );
}
