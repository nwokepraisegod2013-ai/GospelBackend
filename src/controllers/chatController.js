import ChatMessage from '../models/ChatMessage.js';
import Content from '../models/Content.js';
import { NotFoundError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const getMessages = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const content = await Content.findById(contentId);
    if (!content) {
      throw new NotFoundError('Content not found');
    }
    
    const skip = (page - 1) * limit;
    
    const messages = await ChatMessage.find({ contentId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await ChatMessage.countDocuments({ contentId });
    
    res.status(200).json({
      success: true,
      data: messages.reverse(),
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    const { message } = req.body;
    
    const content = await Content.findById(contentId);
    if (!content) {
      throw new NotFoundError('Content not found');
    }
    
    const chatMessage = new ChatMessage({
      contentId,
      author: req.user._id,
      message,
    });
    
    await chatMessage.save();
    await chatMessage.populate('author', 'name avatar');
    
    logger.info(`Chat message created: ${chatMessage._id}`);
    
    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: chatMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      throw new NotFoundError('Message not found');
    }
    
    // Check authorization
    if (message.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message',
      });
    }
    
    await ChatMessage.findByIdAndDelete(messageId);
    
    logger.info(`Chat message deleted: ${messageId}`);
    
    res.status(200).json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getMessages,
  sendMessage,
  deleteMessage,
};
