    // app/page.js (пример использования)
    'use client';

    import { useTelegram } from '../hooks/useTelegram';
    import { useEffect } from 'react';
    import { useRouter } from 'next/navigation';

    function HomePage() {
      const { user, loading, telegramUser, loginUser } = useTelegram();
      const router = useRouter();

      // Перенаправляем, если пользователь уже авторизован
      useEffect(() => {
        if (!loading && user) {
          router.push('/users');
        }
      }, [loading, user, router]);

      const handleLogin = async () => {
        if (telegramUser) {
          await loginUser(telegramUser); // loginUser уже вызывает fetch и перенаправление
        } else {
          alert("Данные Telegram недоступны. Пожалуйста, перезапустите приложение.");
        }
      };

      // Отображаем кнопку только если не идет загрузка и нет авторизованного пользователя
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>Добро пожаловать!</h1>
          {!user && !loading && (
            <button onClick={handleLogin} style={{ padding: '15px 30px', fontSize: '18px' }}>
              Войти
            </button>
          )}
          {loading && <p>Загрузка...</p>}
        </div>
      );
    }

    export default HomePage;
