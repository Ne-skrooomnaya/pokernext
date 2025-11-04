// app/layout.js
import './globals.css'; // Подключаем глобальные стили
import { TelegramProvider } from '@/hooks/useTelegram'; // Путь к вашему хуку
export default function RootLayout({ children }) {
  return (
        <html lang="en">
          <body>
            <TelegramProvider>
              {children}
            </TelegramProvider>
          </body>
        </html>
      );
    }
