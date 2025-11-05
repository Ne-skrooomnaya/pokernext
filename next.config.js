    /** @type {import('next').NextConfig} */
    const nextConfig = {
        experimental: {
    turbo: {
      enabled: false, // <<< Добавьте эту строку
    },
  },
      async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: `https://poker-2uv1.onrender.com/api/:path*`,
          },
        ];
      },
      // Для локальной разработки:
      // async headers() {
      //   return [
      //     {
      //       source: '/(.*)',
      //       headers: [
      //         {
      //           key: 'Access-Control-Allow-Origin',
      //           value: '*', // Или конкретный домен вашего фронтенда
      //         },
      //         {
      //           key: 'Access-Control-Allow-Methods',
      //           value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      //         },
      //         {
      //           key: 'Access-Control-Allow-Headers',
      //           value: 'X-CSRF-Token, Content-Type, Authorization',
      //         },
      //       ],
      //     },
      //   ];
      // },
    };

    module.exports = nextConfig;
