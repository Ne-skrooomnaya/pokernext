        // app/layout.js
        import { Inter } from 'next/font/google';
        import './globals.css';
        // Импортируем Client-wrapper компонент
        import ClientLayoutWrapper from './ClientLayoutWrapper'; // Создадим его ниже

        const inter = Inter({ subsets: ['latin'] });

        export const metadata = {
          title: 'Model Poker',
          description: 'Your poker companion',
        };

        export default function RootLayout({ children }) {
          return (
            <html lang="en">
              <body className={inter.className}>
                {/* Здесь только Server Components */}
                <ClientLayoutWrapper>
                  {children}
                </ClientLayoutWrapper>
              </body>
            </html>
          );
        }
