// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: [true, 'Telegram ID is required'],
    unique: true,
  },
  username: {
    type: String,
    trim: true,
    default: null,
  },
  firstName: {
    type: String,
    required: true,
  },
  // Дополнительные поля для игры
  pokerRating: {
    type: Number,
    default: 1000, // Начальный рейтинг
  },
  // ... другие поля
}, { timestamps: true });

// Важно: проверяем, существует ли модель, чтобы избежать ошибок в Next.js hot-reload
export default mongoose.models.User || mongoose.model('User', UserSchema);
