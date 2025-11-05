    // app/layout.js (или app/page.js)
    'use client';

    import { useEffect } from 'react';

    export default function RootLayout({ children }) {
      useEffect(() => {
        // Подключаем скрипт Telegram Web App, если его еще нет
        if (!document.getElementById('telegram-web-app-sdk')) {
          const script = document.createElement('script');
          script.id = 'telegram-web-app-sdk';
          script.src = 'https://telegram.org/js/telegram-web-app.js';
          script.async = true;
          document.body.appendChild(script);

          script.onload = () => {
            console.log('Telegram Web App SDK loaded.');
            if (window.Telegram && window.Telegram.WebApps) {
              window.Telegram.WebApps.ready();
            }
          };
          script.onerror = () => {
            console.error('Failed to load Telegram Web App SDK.');
          };
        }
      }, []); // Выполняется только один раз при монтировании компонента

      return (
        <html lang="en">
          <body>
            {children}
          </body>
        </html>
      );
    }
