import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const formatLog = (level, message, data = null) => {
  const timestamp = getTimestamp();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
};

const levelPriority = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();

const shouldLog = (level) => {
  const currentPriority = levelPriority[currentLevel] ?? levelPriority.info;
  return levelPriority[level] >= currentPriority;
};

const writeToConsole = (message, isError = false) => {
  const stream = isError ? process.stderr : process.stdout;
  stream.write(`${message}\n`);
};

const writeToFile = (message, filename) => {
  try {
    const filepath = path.join(logsDir, filename);
    fs.appendFileSync(filepath, message + '\n');
  } catch {
    writeToConsole(`Failed to write log to file: ${filename}`, true);
  }
};

const logger = {
  info: (message, data = null) => {
    if (!shouldLog('info')) return;
    const log = formatLog('info', message, data);
    writeToConsole(log);
    writeToFile(log, 'info.log');
  },

  error: (message, data = null) => {
    if (!shouldLog('error')) return;
    const log = formatLog('error', message, data);
    writeToConsole(log, true);
    writeToFile(log, 'error.log');
  },

  warn: (message, data = null) => {
    if (!shouldLog('warn')) return;
    const log = formatLog('warn', message, data);
    writeToConsole(log);
    writeToFile(log, 'warn.log');
  },

  debug: (message, data = null) => {
    if (!shouldLog('debug')) return;
    const log = formatLog('debug', message, data);
    writeToConsole(log);
    writeToFile(log, 'debug.log');
  },
};

export default logger;
