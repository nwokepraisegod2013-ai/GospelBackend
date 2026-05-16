import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
} from '../controllers/authController.js';
import {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
} from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, validateUserUpdate, updateProfile);

export default router;
