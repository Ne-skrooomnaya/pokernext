        // app/ClientLayoutWrapper.js
        'use client';

        // import { AuthProvider } from '../hooks/useTelegram'; // Импортируем AuthProvider
        import { useEffect } from 'react'; // Для логики загрузки Telegram SDK

        export default function ClientLayoutWrapper({ children }) {
          // Логика для загрузки Telegram SDK, которая должна быть на клиенте
          useEffect(() => {
            if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
              try {
                // init() может быть здесь, если он также зависит от browser API
                // или вы хотите, чтобы он запускался только на клиенте.
                // Если init() не обращается к window, его можно оставить в useTelegram
                window.Telegram.WebApp.ready();
                console.log('Telegram Web App SDK ready called from ClientLayoutWrapper.');
              } catch (error) {
                console.error('Error calling Telegram Web App ready:', error);
              }
            } else {
              console.warn('Telegram Web App SDK not available in this environment for ClientLayoutWrapper.');
            }
          }, []);

          return (
              {children}
          );
        }
