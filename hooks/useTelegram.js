    // hooks/useTelegram.js (улучшенный)
    import { useEffect, useState } from 'react';
    import SDK from '@twa-dev/sdk'; // Импортируем SDK как объект

    const useTelegram = () => {
      const [user, setUser] = useState(null);
      const [tg, setTg] = useState(null);

      useEffect(() => {
        const initializeTelegram = async () => {
          // Проверяем, что код выполняется в браузере и Telegram Web App SDK доступен
          if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
            try {
              // Используем SDK.init()
              await SDK.init();

              const tgInstance = window.Telegram.WebApp;
              setTg(tgInstance);

              if (tgInstance.initData) {
                // Используем SDK.parseInitData()
                const initData = SDK.parseInitData(tgInstance.initData);
                setUser(initData.user);
                console.log('Telegram User:', initData.user);
              } else {
                console.warn('No initData found. Ensure the app is opened via Telegram.');
              }

              // Убеждаемся, что Web App готов.
              tgInstance.ready();
              console.log('Telegram Web App SDK initialized and ready.');

            } catch (error) {
              console.error('Error initializing Telegram SDK:', error);
            }
          } else {
            console.warn('Telegram Web App SDK not available in this environment or not loaded.');
          }
        };

        initializeTelegram();
      }, []);

      return { tg, user };
    };

    export default useTelegram;
