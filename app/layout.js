// app/layout.js
import './globals.css';
import { TelegramProvider } from '../hooks/useTelegram'; // Убедитесь, что путь правильный

export const metadata = {
  title: 'Poker Mini App',
  description: 'Welcome to the Poker Mini App!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        {/* Оборачиваем все приложение в TelegramProvider */}
        <TelegramProvider>
          {children}
        </TelegramProvider>
        {/* Не добавляйте <script> здесь, если используете динамическую загрузку в провайдере */}
      </body>
    </html>
  );
}
