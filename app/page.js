// app/page.js (адаптированный для авторизации)
'use client';

import React, { useEffect, useState } from 'react';
import useTelegram from '@/hooks/useTelegram'; // Путь к вашему хуку
import { useRouter } from 'next/navigation'; // Для навигации

// Предполагаем, что API /api/path возвращает данные, если пользователь авторизован
async function fetchGameData() {
  const res = await fetch('/api/path'); // Ваш API-эндпоинт
  if (!res.ok) {
    throw new Error(`Failed to fetch game data. Status: ${res.status}`);
  }
  return res.json();
}

export default function HomePage() {
  const { tg, user } = useTelegram();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- Проверка Telegram Web App и пользователя ---
    if (!tg) {
      // Если Telegram SDK не инициализировался, показываем сообщение об ошибке.
      // Никакие дальнейшие действия не имеют смысла.
      setError("Telegram Web App SDK not available. Please open this app in Telegram.");
      setIsLoading(false);
      return; // Выходим из useEffect
    }

    // Если Telegram SDK есть, но user (из initData) отсутствует:
    if (tg && !user) {
      // Это значит, что пользователь не авторизован через Telegram initData.
      // Перенаправляем на страницу авторизации/логина.
      // Убедись, что '/login' - это правильный путь для твоей страницы логина.
      console.log("User not found in initData, redirecting to login...");
      router.push('/login'); // Перенаправляем на страницу входа
      setIsLoading(false); // Прекращаем загрузку, так как перенаправляем
      return; // Выходим из useEffect
    }

    // --- Если tg и user есть, пробуем загрузить данные ---
    // Это означает, что пользователь авторизован через Telegram initData.
    fetchGameDataAndSetState();

  }, [tg, user, router]); // Зависимости: tg, user, router

  const fetchGameDataAndSetState = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedData = await fetchGameData();
      setData(fetchedData);
    } catch (err) {
      console.error("Error fetching game data:", err);
      // Если ошибка при fetch, возможно, это связано с тем, что middleware
      // вернул 401, если токен истек.
      if (err.message.includes('401')) {
        setError("Your session has expired. Please log in again.");
        // Можно добавить перенаправление на логин, если сессия истекла
        // router.push('/login');
      } else {
        setError(err.message || "Failed to load game data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Рендеринг ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading game data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // --- Основной контент (отображается только если tg и user есть) ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Welcome, {user.username || user.first_name}!</h1>
        <p>Your Telegram ID: {user.id}</p>

        <div className="mt-8 w-full">
          <h2 className="text-2xl mb-4">Game Data:</h2>
          {data && data.length > 0 ? (
            <ul className="space-y-2">
              {data.map((item) => (
                <li key={item.id || item.name} className="bg-gray-800 p-3 rounded-lg shadow-md">
                  <p><strong>ID:</strong> {item.id || 'N/A'}</p>
                  <p><strong>Name:</strong> {item.name || 'N/A'}</p>
                  {item.details && <p><strong>Details:</strong> {item.details}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>No game data available.</p>
          )}
        </div>

        {tg && (
          <button
            onClick={() => tg.close()}
            className="mt-8 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Close Web App
          </button>
        )}
      </div>
    </main>
  );
}
