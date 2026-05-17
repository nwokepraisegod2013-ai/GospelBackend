import express from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from '../controllers/chatController.js';
import {
  validateChatMessage,
  validateMongoId,
} from '../middleware/validation.js';

const router = express.Router();

router.get('/:contentId/messages', validateMongoId, getMessages);
router.post('/:contentId/messages', optionalAuthenticate, validateMongoId, validateChatMessage, sendMessage);
router.delete('/messages/:messageId', authenticate, validateMongoId, deleteMessage);

export default router;
