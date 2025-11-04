// app/admin/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me'); // Получаем данные текущего пользователя
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // Важно: проверяем, является ли пользователь админом.
          // Если нет, перенаправляем обратно на страницу рейтинга или главную.
          if (data.role !== 'admin') {
            router.push('/users'); // Или '/'
          }
        } else if (response.status === 401) {
          router.push('/'); // Если не авторизован, на главную
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return <div>Загрузка данных администратора...</div>;
  }

  if (!userData || userData.role !== 'admin') {
    // Если данных нет или роль не админ, перенаправляем
    router.push('/');
    return null;
  }

  return (
    <div>
      <h1>Панель Администратора</h1>
      <p>Добро пожаловать, Админ {userData.firstName || userData.username}!</p>
      {/* Здесь будет контент для админа */}
      <p>Вы можете управлять пользователями, играми и т.д.</p>
    </div>
  );
}
