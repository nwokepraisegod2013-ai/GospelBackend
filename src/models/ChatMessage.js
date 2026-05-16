import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message cannot be empty'],
      maxlength: [500, 'Message cannot be more than 500 characters'],
    },
    likes: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
chatMessageSchema.index({ contentId: 1, createdAt: -1 });
chatMessageSchema.index({ author: 1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
