// components/PageWrapper.js
"use client"; // Обязательно!

import dynamic from 'next/dynamic';

// 1. Динамически импортируем TwaAuth (логика TWA)
const TwaAuthNoSSR = dynamic(() => import('./TwaAuth'), {
  ssr: false, // Теперь эта строка находится внутри клиентского компонента
  loading: () => <p>Loading TWA application...</p>,
});

// 2. Обертка, которая просто рендерит динамический компонент
export default function PageWrapper() {
  return <TwaAuthNoSSR />;
}

