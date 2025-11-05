// /* eslint-disable react-hooks/set-state-in-effect */
// // hooks/useTelegram.js
// import { useEffect, useState } from 'react';

// const useTelegram = () => {
//   const [tg, setTg] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isClient, setIsClient] = useState(false); // Флаг, чтобы отслеживать, выполняется ли код на клиенте

//   useEffect(() => {
//     setIsClient(true); // Устанавливаем флаг, что мы на клиенте
//   }, []); // Этот useEffect выполняется только на клиенте

//   useEffect(() => {
//     // Выполняем этот useEffect только если мы на клиенте
//     if (isClient) {
//       const TelegramWebApps = window.Telegram?.WebApps; // Используем опциональную цепочку
//       if (TelegramWebApps) {
//         TelegramWebApps.ready(); // Сообщаем Telegram, что приложение готово
//         setTg(TelegramWebApps);
//         setUser(TelegramWebApps.initDataUnsafe.user);
//       } else {
//         console.warn('Telegram Web Apps API not available. Are you running in a Telegram Mini App context?');
//       }
//     }
//   }, [isClient]); // Зависимость от isClient, чтобы запустить после установки флага

//   return { tg, user };
// };

// export default useTelegram;
