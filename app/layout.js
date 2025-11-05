// app/layout.js
import './globals.css'; // Подключаем глобальные стили

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/*
          Для Telegram Web App нужно, чтобы скрипт был доступен.
          Его можно подключить здесь, либо через Next.js Script компонент,
          или просто полагаться на то, что он будет передан через WebView.
          Если вы используете Telegram Web App SDK, возможно, вам потребуется
          включить его через CDN, если он не встраивается автоматически.
          Обычно Telegram сам передает нужные скрипты в WebView.
        */}
        <header>
          {/* Ваш заголовок или навигация */}
        </header>
        <main>{children}</main>
        <footer>
          {/* Ваш футер */}
        </footer>
      </body>
    </html>
  );
}
