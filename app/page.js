// app/page.js (полностью переписанный, без моков, с фокусом на API)
'use client'; // Это очень важно, так как используется useState, useEffect, useRouter

import React, { useEffect, useState } from 'react';
import useTelegram from '@/hooks/useTelegram'; // Путь к вашему хуку
import { useRouter } from 'next/navigation'; // Для навигации

// Эта функция будет делать реальный fetch запрос
async function fetchGameData() {
  // !!! ВАЖНО: Убедитесь, что путь '/api/path' соответствует вашему next.config.js
  // Если вы используете 'source: '/api/:path*'' в rewrites, то этот fetch должен быть '/api/path'
  // и destination в rewrites должен быть 'https://poker-2uv1.onrender.com/api/:path*'
  const res = await fetch('/api/path'); // Путь для fetch запроса

  if (!res.ok) {
    // Если ответ сервера не OK (например, 404, 500), бросаем ошибку.
    // Это позволит попасть в блок catch ниже.
    throw new Error(`Failed to fetch game data. Status: ${res.status}`);
  }
  return res.json(); // Парсим JSON из ответа
}

export default function HomePage() {
  const { tg, user } = useTelegram(); // Используем хук для доступа к Telegram API
  const router = useRouter(); // Инициализируем роутер

  // Состояние для данных, статуса загрузки и ошибок
  const [data, setData] = useState([]); // Инициализируем как пустой массив
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect для инициализации Telegram и загрузки данных
  useEffect(() => {
    // --- Проверка Telegram Web App ---
    if (!tg && typeof window !== 'undefined') {
      // Если SDK не инициализировался (например, не в Telegram Web App)
      setError("Telegram Web App SDK not available. Please open this app in Telegram.");
      setIsLoading(false); // Прекращаем загрузку, так как нет возможности работать
      return; // Выходим из эффекта, чтобы не пытаться загружать данные
    }

    // Если Telegram SDK есть, но user не определился (нет initData)
    if (tg && !user) {
      // В зависимости от вашей логики, можно:
      // 1. Отобразить сообщение, что нет данных пользователя (но приложение все равно работает)
      // 2. Перенаправить пользователя на другую страницу (например, для авторизации, если это необходимо)
      console.warn("User data not found in Telegram initData.");
      setError("Could not retrieve user data from Telegram initData. Please ensure you opened the app via a Telegram link.");
      // Если вы хотите, чтобы приложение вообще не работало без initData:
      // setIsLoading(false);
      // return;
    }

    // --- Загрузка данных (только если Telegram инициализирован и user есть, или мы решили работать без user) ---
    // В данном случае, я предполагаю, что данные должны загружаться, даже если user нет,
    // но вы можете изменить это условие.
    // if (tg && user) { // Если нужно загружать данные только если user есть
       fetchGameDataAndSetState();
    // } else if (tg && !user) { // Если разрешаем загружать без user, но сообщаем об этом
    //   fetchGameDataAndSetState();
    // }


  }, [tg, user, router]); // Зависимости: tg, user, router

  // Отдельная функция для загрузки данных, чтобы ее можно было вызвать из useEffect
  const fetchGameDataAndSetState = async () => {
    setIsLoading(true); // Начинаем загрузку
    setError(null);     // Сбрасываем предыдущие ошибки

    try {
      const fetchedData = await fetchGameData(); // Вызываем функцию fetch
      setData(fetchedData); // Устанавливаем полученные данные
    } catch (err) {
      console.error("Error fetching game data:", err);
      setError(err.message || "Failed to load game data."); // Устанавливаем ошибку
    } finally {
      setIsLoading(false); // Заканчиваем загрузку (независимо от успеха или ошибки)
    }
  };

  // --- Рендеринг ---

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading game data...</p>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // --- Основной контент ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Отображение информации о пользователе, если она есть */}
      {!tg ? (
        <div className="text-center">
          <p>Please open this app in Telegram.</p>
          <p>Telegram Web App SDK not available.</p>
        </div>
      ) : !user ? (
        <div className="text-center">
          <p>Welcome!</p>
          <p>Could not retrieve your Telegram user data.</p>
          <p>Ensure you opened the app via a Telegram link with initData.</p>
        </div>
      ) : (
        // Если tg и user есть, показываем основную информацию
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <h1>Welcome, {user.username || user.first_name}!</h1>
          <p>Your Telegram ID: {user.id}</p>
        </div>
      )}

      {/* Отображение данных из API */}
      <div className="mt-8 w-full">
        <h2 className="text-2xl mb-4">Game Data:</h2>
        {data && data.length > 0 ? (
          <ul className="space-y-2">
            {data.map((item) => (
              // !!!!! КРИТИЧЕСКИ ВАЖНО: Убедитесь, что 'item' имеет уникальное поле для 'key' !!!!!
              // Если у вас нет 'item.id', вам нужно найти другое уникальное поле,
              // или генерировать его, но это менее предпочтительно.
              // Например, если у вас есть item.gameId или item.uuid.
              <li key={item.id || item.uuid || item.name} className="bg-gray-800 p-3 rounded-lg shadow-md">
                <p><strong>ID:</strong> {item.id || 'N/A'}</p>
                <p><strong>Name:</strong> {item.name || 'N/A'}</p>
                {/* Добавьте сюда другие поля, которые вы хотите отобразить из item */}
                {item.details && <p><strong>Details:</strong> {item.details}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No game data available or data is empty.</p> // Сообщение, если массив данных пуст
        )}
      </div>

      {/* Пример кнопки, использующей Telegram API */}
      {tg && (
        <button
          onClick={() => tg.close()}
          className="mt-8 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Close Web App
        </button>
      )}
    </main>
  );
}