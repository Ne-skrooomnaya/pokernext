'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Импорт стилей
import pageStyles from './page.module.css'; // Для общего контейнера страницы и кнопки выхода
import logoStyles from './logo.module.css'; // Для контейнера логотипа
import topSectionStyles from './top-section.module.css'; // Для верхнего блока и его элементов
import bottomSectionStyles from './bottom-section.module.css'; // Для нижнего блока и его элементов

// Функция для загрузки скрипта Telegram Web App
const loadTelegramWebAppSDK = () => {
  return new Promise((resolve, reject) => {
    const scriptId = 'telegram-web-app-sdk';
    if (document.getElementById(scriptId)) {
      resolve(window.Telegram.WebApp);
      return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.onload = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        resolve(window.Telegram.WebApp);
      } else {
        reject(new Error('Telegram Web App SDK not loaded correctly'));
      }
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const UsersPage = () => {
  const [tg, setTg] = useState(null);

  useEffect(() => {
    loadTelegramWebAppSDK()
      .then((tgInstance) => {
        setTg(tgInstance);
        tgInstance.ready();
        tgInstance.expand();
      })
      .catch((error) => {
        console.error('Error loading Telegram Web App SDK:', error);
      });
  }, []);

  const handleLogout = () => {
    if (tg) {
      tg.close();
    } else {
      alert('Telegram Web App SDK не инициализирован. Невозможно выйти.');
    }
  };

  return (
    <div className={pageStyles.pageContainer}> {/* Используем класс для всего контейнера страницы */}

      {/* Логотип */}
      <div className={logoStyles.logoContainer}>
        <img src="/images/logo.svg" alt="Poker Logo" className={logoStyles.logoImage} />
      </div>

      {/* Верхний блок */}
      <div className={topSectionStyles.topSection}>
        <div className={topSectionStyles.topSectionImg}>
          {/* Используем img для SVG. Путь к файлу в public/images */}
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

      {/* Нижний блок */}
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

      {/* Кнопка "Выйти" */}
      {tg && (
        <button onClick={handleLogout} className={pageStyles.logoutButton}>
          Выйти
        </button>
      )}
    </div>
  );
};

export default UsersPage;
