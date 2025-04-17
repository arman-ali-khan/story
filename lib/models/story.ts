import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  genre: {
    type: String,
    required: true,
    enum: ['romance', 'horror', 'mystery', 'drama', 'poetry', 'other'],
  },
  language: {
    type: String,
    required: true,
    default: 'bn', // Bengali
    enum: ['bn', 'en', 'hi'], // Bengali, English, Hindi
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  chapters: [chapterSchema],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Story || mongoose.model('Story', storySchema);