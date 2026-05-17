import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    subtitle: {
      type: String,
      maxlength: [500, 'Subtitle cannot be more than 500 characters'],
    },
    description: {
      type: String,
      maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    type: {
      type: String,
      enum: ['video', 'music', 'book', 'live'],
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    contentUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['sermon', 'worship', 'devotional', 'teaching', 'testimony', 'other'],
      default: 'other',
    },
    tags: [String],
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    streamUrl: {
      type: String, // For live streaming
    },
    liveStartTime: Date,
    liveEndTime: Date,
    // Music-specific metadata
    artist: {
      type: String,
      maxlength: [200, 'Artist name too long'],
    },
    album: {
      type: String,
      maxlength: [200, 'Album name too long'],
    },
    trackNumber: {
      type: Number,
    },
    genre: {
      type: String,
    },
    bitrate: {
      type: Number, // kbps
    },
    sampleRate: {
      type: Number, // Hz
    },
    audioFormat: {
      type: String, // mp3, wav, m4a, etc.
    },
    lyricsUrl: {
      type: String,
    },
    explicit: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
contentSchema.index({ author: 1 });
contentSchema.index({ type: 1, isPublished: 1 });
contentSchema.index({ isLive: 1 });
contentSchema.index({ createdAt: -1 });

export default mongoose.model('Content', contentSchema);
