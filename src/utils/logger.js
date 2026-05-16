import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

const formatLog = (level, message, data = null) => {
  const timestamp = getTimestamp();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataStr}`;
};

const logger = {
  info: (message, data = null) => {
    const log = formatLog('INFO', message, data);
    console.log(log);
    writeToFile(log, 'info.log');
  },
  
  error: (message, data = null) => {
    const log = formatLog('ERROR', message, data);
    console.error(log);
    writeToFile(log, 'error.log');
  },
  
  warn: (message, data = null) => {
    const log = formatLog('WARN', message, data);
    console.warn(log);
    writeToFile(log, 'warn.log');
  },
  
  debug: (message, data = null) => {
    const log = formatLog('DEBUG', message, data);
    console.log(log);
    writeToFile(log, 'debug.log');
  },
};

const writeToFile = (message, filename) => {
  try {
    const filepath = path.join(logsDir, filename);
    fs.appendFileSync(filepath, message + '\n');
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
};

export default logger;
