        // lib/jwt.js
        import jwt from 'jsonwebtoken';

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
          throw new Error('JWT_SECRET must be defined in .env.local');
        }

        export const generateToken = (userId) => {
          return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' }); // Токен действителен 7 дней
        };

        export const verifyToken = (token) => {
          try {
            return jwt.verify(token, JWT_SECRET);
          } catch (error) {
            return null; // Невалидный токен
          }
        };
