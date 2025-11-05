'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useTelegram from '../../hooks/useTelegram'; // Убедитесь, что путь правильный
// Импорт стилей
import pageStyles from './page.module.css'; // Для общего контейнера страницы и кнопки выхода
import logoStyles from './logo.module.css'; // Для контейнера логотипа
import topSectionStyles from './top-section.module.css'; // Для верхнего блока и его элементов
import bottomSectionStyles from './bottom-section.module.css'; // Для нижнего блока и его элементов


const UsersPage = () => {
  const { tg, isLoading, error, closeApp, getInitData } = useTelegram();
  const [userData, setUserData] = useState(null); // Состояние для хранения данных пользователя с бэкенда

  useEffect(() => {
    if (error) {
      // Обработка ошибки инициализации Telegram API (например, показать сообщение пользователю)
      alert(`Ошибка инициализации Telegram: ${error}`);
      return;
    }

    if (tg) {
      const initData = getInitData(); // Получаем initData
      console.log('Init Data:', initData); // Для отладки

      if (initData) {
        // Здесь отправляем initData на ваш бэкенд для аутентификации
        // Предполагается, что у вас есть API endpoint '/api/auth/telegram'
        fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData: initData }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Authentication successful:', data);
            setUserData(data); // Сохраняем данные пользователя (например, имя, ID из БД)
            // Теперь вы можете использовать userData для отображения информации
          })
          .catch(authError => {
            console.error('Authentication failed:', authError);
            // Обработка ошибки аутентификации (например, перенаправление на страницу входа или показ сообщения)
            alert('Ошибка аутентификации. Пожалуйста, попробуйте снова.');
          });
      } else {
        console.log('initData is not available.');
        // Возможно, пользователю нужно дать возможность войти другим способом или показать сообщение
      }
    }
  }, [tg, error, getInitData]); // Зависимости: tg, error, getInitData

  // Если идет загрузка Telegram API
  if (isLoading) {
    return <div className={pageStyles.loadingScreen}>Загрузка Telegram...</div>;
  }

  // Если произошла ошибка
  if (error) {
    return <div className={pageStyles.errorScreen}>Ошибка: {error}</div>;
  }

  // Если tg не доступен (несмотря на успешную загрузку, что маловероятно)
  if (!tg) {
    return <div className={pageStyles.errorScreen}>Telegram API не удалось инициализировать.</div>;
  }

  // Отображение, когда все загружено и аутентификация прошла (или обрабатывается)

  return (
    <div className={pageStyles.pageContainer}>
      <div className={logoStyles.logoContainer}>
        <img src="/images/logo.svg" alt="Poker Logo" className={logoStyles.logoImage} />
      </div>

      <div className={topSectionStyles.topSection}>
        <div className={topSectionStyles.topSectionImg}>
          <img src="/images/chip.svg" alt="Poker Chip" />
        </div>
        <div className={topSectionStyles.topButtons}>
          <Link href="/rating" passHref>
            <button className={topSectionStyles.topButton}>Рейтинг</button>
          </Link>
          <Link href="/race" passHref>
            <button className={topSectionStyles.topButton}>Гонка месяца</button>
          </Link>
          <Link href="/past_games" passHref>
            <button className={topSectionStyles.topButton}>Прошедшие игры</button>
          </Link>
        </div>
      </div>

      <div className={bottomSectionStyles.bottomSection}>
        <Link href="/menu" passHref>
          <button className={bottomSectionStyles.bottomSectionButton}>Меню</button>
        </Link>
        <Link href="/tea" passHref>
          <button className={bottomSectionStyles.bottomSectionButton}>Чайная карта</button>
        </Link>
        <Link href="/parkour" passHref>
          <button className={bottomSectionStyles.bottomSectionButton}>Паркур</button>
        </Link>
        <Link href="/bar_map" passHref>
          <button className={bottomSectionStyles.bottomSectionButton}>Карта бара</button>
        </Link>
      </div>

      {/* Кнопка "Выйти" - теперь использует метод из TelegramProvider */}
      <button onClick={closeApp} className={pageStyles.logoutButton}>
        Выйти
      </button>
    </div>
  );
};

export default UsersPage;
