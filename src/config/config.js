import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gospel_platform',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production_12345',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600'), // 100MB
  
  // CORS
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  
  // File Upload
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  
  // Cloudinary (optional)
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  
  // Email
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  
  // Redis (optional)
  redisUrl: process.env.REDIS_URL,
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
