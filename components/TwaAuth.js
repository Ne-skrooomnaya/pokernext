// components/TwaAuth.js
"use client"; // Обязательно!

import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'; 

export default function TwaAuth() {
  const [authStatus, setAuthStatus] = useState('Initializing...');
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Проверка, что WebApp SDK загружен и доступен
    if (!WebApp.initData) {
      setAuthStatus('Error: Not running inside Telegram Web App.');
      return;
    }

    const initData = WebApp.initData;

    const authenticate = async () => {
      setAuthStatus('Authenticating...');
      // ... (Остальная логика аутентификации, как в предыдущем примере)
      try {
        const response = await fetch(`${API_URL}/auth/telegram`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData }),
        });
        const data = await response.json();
        if (response.ok) {
            setToken(data.token);
            localStorage.setItem('authToken', data.token); 
            setAuthStatus(`Authentication successful!`);
        } else {
            setAuthStatus(`Authentication failed: ${data.message}`);
        }
      } catch (error) {
        setAuthStatus('Network error during authentication.');
      }
    };

    authenticate();
  }, []);

  return (
    <div>
      <h1>Model Poker TWA</h1>
      <p>Status: {authStatus}</p>
      {token && <p>JWT Token received. Welcome!</p>}
    </div>
  );
}

