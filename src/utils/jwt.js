import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import logger from './logger.js';

export const generateToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpire,
    });
  } catch (error) {
    logger.error('Error generating token', error);
    throw error;
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    logger.error('Error verifying token', error);
    throw error;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Error decoding token', error);
    throw error;
  }
};

export default { generateToken, verifyToken, decodeToken };
