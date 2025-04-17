import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['reader', 'writer', 'admin'],
    default: 'reader',
  },
  image: String,
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  }],
});

export default mongoose.models.User || mongoose.model('User', userSchema);