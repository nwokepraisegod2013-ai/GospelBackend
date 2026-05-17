import express from 'express';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js';
import {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  likeContent,
} from '../controllers/contentController.js';
import {
  validateContentCreation,
  validateContentUpdate,
  validateMongoId,
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllContent);
router.get('/:id', validateMongoId, getContentById);
router.post('/', authenticate, authorize('creator', 'admin'), validateContentCreation, createContent);
router.put('/:id', authenticate, validateMongoId, validateContentUpdate, updateContent);
router.delete('/:id', authenticate, validateMongoId, deleteContent);
router.post('/:id/like', optionalAuthenticate, validateMongoId, likeContent);

export default router;
