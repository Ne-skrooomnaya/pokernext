// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // turbo: {
    //   enabled: false, // << Добавьте эту строку, если TurboPack вызывает проблемы
    // },
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*', // <-- Проблема может быть здесь, если 'api' уже занят
  //       destination: 'https://poker-2uv1.onrender.com/api/:path*',
  //     },
  //   ];
  // },
  // async headers() { // Этот блок закомментирован и не используется
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         { key: 'Access-Control-Allow-Origin', value: '*' },
  //         { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
  //         { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, Content-Type, Authorization' },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
