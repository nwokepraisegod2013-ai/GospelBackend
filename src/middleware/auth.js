import { UnauthorizedError } from '../utils/errors.js';
import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }
    
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error', error.message);
    res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || 'Authentication failed',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }
    
    next();
  };
};

export default { authenticate, authorize };
