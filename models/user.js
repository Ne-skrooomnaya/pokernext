// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  // Добавьте другие поля, если они есть в вашей модели
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Предотвращаем повторное создание модели
// Это важно для hot-reloading в dev режиме
export default mongoose.models.User || mongoose.model('User', UserSchema);
