    // models/user.js
    import mongoose from 'mongoose';

    const userSchema = new mongoose.Schema({
      telegramId: { type: Number, required: true, unique: true },
      username: { type: String, required: true },
      firstName: String,
      lastName: String,
      registrationDate: { type: Date, default: Date.now },
      // Другие поля, например:
      // wins: { type: Number, default: 0 },
      // losses: { type: Number, default: 0 },
    });

    export default mongoose.models.User || mongoose.model('User', userSchema);
