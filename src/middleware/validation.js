import { validationResult, body, param } from 'express-validator';
import logger from '../utils/logger.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation error', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

export const validateUserLogin = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const validateUserUpdate = [
  body('name').optional().trim().isLength({ max: 100 }).withMessage('Name too long'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio too long'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  validate,
];

// Content validation rules
export const validateContentCreation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title too long'),
  body('subtitle').optional().isLength({ max: 500 }).withMessage('Subtitle too long'),
  body('description').optional().isLength({ max: 5000 }).withMessage('Description too long'),
  body('type').isIn(['video', 'music', 'book', 'live']).withMessage('Invalid content type'),
  body('category').optional().isIn(['sermon', 'worship', 'devotional', 'teaching', 'testimony', 'other']).withMessage('Invalid category'),
  body('thumbnailUrl').isURL().withMessage('Valid thumbnail URL is required'),
  body('contentUrl').isURL().withMessage('Valid content URL is required'),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive number'),
  validate,
];

export const validateContentUpdate = [
  body('title').optional().trim().isLength({ max: 200 }).withMessage('Title too long'),
  body('subtitle').optional().isLength({ max: 500 }).withMessage('Subtitle too long'),
  body('description').optional().isLength({ max: 5000 }).withMessage('Description too long'),
  body('category').optional().isIn(['sermon', 'worship', 'devotional', 'teaching', 'testimony', 'other']).withMessage('Invalid category'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  validate,
];

// Chat validation rules
export const validateChatMessage = [
  body('message').trim().notEmpty().withMessage('Message cannot be empty').isLength({ max: 500 }).withMessage('Message too long'),
  param('contentId').isMongoId().withMessage('Invalid content ID'),
  validate,
];

// ID validation
export const validateMongoId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
];

export default { validate, validateUserRegistration, validateUserLogin, validateContentCreation, validateChatMessage };
