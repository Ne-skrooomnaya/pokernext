// app/ClientLayoutWrapper.js
'use client'; // Указывает, что это клиентский компонент

import React from 'react';
import useTelegram from '@/hooks/useTelegram'; // Убедитесь, что путь к хуку правильный

function ClientLayoutWrapper({ children }) {
  // Вызываем хук здесь, чтобы инициализировать Telegram SDK
  // и сделать его доступным для потомков (если они будут использовать tg или user)
  const { tg, user } = useTelegram();

  // Можно добавить здесь отрисовку чего-то, что зависит от tg или user,
  // но в большинстве случаев достаточно просто вызвать хук, чтобы он выполнил инициализацию.

  console.log('ClientLayoutWrapper - tg:', tg); // Для отладки
  console.log('ClientLayoutWrapper - user:', user); // Для отладки

  return <>{children}</>; // Просто возвращаем дочерние элементы
}

export default ClientLayoutWrapper;
