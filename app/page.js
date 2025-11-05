    // app/page.js
    'use client';

    import { useEffect } from 'react';

    export default function HomePage() {
      useEffect(() => {
        if (!document.getElementById('telegram-web-app-sdk')) {
          const script = document.createElement('script');
          script.id = 'telegram-web-app-sdk';
          script.src = 'https://telegram.org/js/telegram-web-app.js';
          script.async = true;
          document.body.appendChild(script);

          script.onload = () => {
            console.log('Telegram Web App SDK loaded successfully.');
            // Попробуйте проверить доступность здесь
            if (window.Telegram && window.Telegram.WebApps) {
              console.log('Telegram.WebApps is available!');
              window.Telegram.WebApps.ready(); // Все еще вызываем ready
            } else {
              console.error('Telegram.WebApps is NOT available after SDK loaded.');
            }
          };
          script.onerror = () => {
            console.error('Failed to load Telegram Web App SDK.');
          };
        }
      }, []);

      return (
        <div>
          <h1>Testing Telegram SDK Loading...</h1>
          <p>Check the console for messages.</p>
          <p>Username: {user.username || 'N/A'}</p>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>Добро пожаловать!</h1>
          {!user && !loading && (
            <button onClick={handleLogin} style={{ padding: '15px 30px', fontSize: '18px' }}>
              Войти
            </button>
          )}
          {loading && <p>Загрузка...</p>}
        </div>
        </div>
      );
    }

