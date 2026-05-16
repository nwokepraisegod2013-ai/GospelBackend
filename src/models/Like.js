import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create unique index to prevent duplicate likes
likeSchema.index({ contentId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Like', likeSchema);
