// // hooks/useTelegram.js (исправленный)
// import { useEffect, useState } from 'react';
// // import { init, parseInitData } from '@twa-dev/sdk'; // Можно импортировать SDK как объект
// import SDK from '@twa-dev/sdk'; // Используем SDK как объект для доступа ко всем методам

// const useTelegram = () => {
//   const [user, setUser] = useState(null);
//   const [tg, setTg] = useState(null);

//   useEffect(() => {
//     const initializeTelegram = async () => {
//       // Проверяем, что код выполняется в браузере и Telegram Web App SDK доступен
//       if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
//         try {
//           // Инициализация SDK. SDK.init() асинхронный.
//           await SDK.init(); // Убедимся, что await есть

//           const tgInstance = window.Telegram.WebApp; // Теперь window.Telegram.WebApp точно существует
//           setTg(tgInstance); // Сохраняем экземпляр

//           // Парсим initData, если он есть
//           if (tgInstance.initData) {
//             // Используем SDK.parseInitData, если импортировали SDK как объект
//             const initData = SDK.parseInitData(tgInstance.initData);
//             setUser(initData.user);
//             console.log('Telegram User:', initData.user);
//           } else {
//             console.warn('No initData found. Ensure the app is opened via Telegram.');
//             // Если initData нет, user останется null. Это нормально, если вы все равно хотите работать.
//             // Но для авторизации это проблема.
//           }

//           // Убеждаемся, что Web App готов.
//           tgInstance.ready();
//           console.log('Telegram Web App SDK initialized and ready.');

//         } catch (error) {
//           console.error('Error initializing Telegram SDK:', error);
//           // При ошибке инициализации, tg и user останутся null.
//           // Возможно, стоит установить tg в null, чтобы явно показать, что SDK не работает.
//           setTg(null);
//           setUser(null);
//         }
//       } else {
//         // Если код выполняется не в браузере или Telegram Web App SDK не загружен
//         console.warn('Telegram Web App SDK not available in this environment or not loaded.');
//         // tg и user останутся null.
//       }
//     };

//     initializeTelegram();
//   }, []); // Пустой массив зависимостей: эффект выполняется один раз при монтировании.

//   return { tg, user };
// };

// export default useTelegram;
