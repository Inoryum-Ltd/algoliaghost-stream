const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Function to ensure the logs folder exists
const ensureLogsFolder = () => {
  const logsFolder = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
  }
};

// Create logs folder if it doesn't exist
ensureLogsFolder();

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info', // Set the minimum log level to output
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // Log to the console
    new winston.transports.Console(),
    // Log to a rotating file with date pattern
    new DailyRotateFile({
      filename: path.join(__dirname, '../logs', 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m', // Maximum size of the log file before rotation
      maxFiles: '7d' // Retain logs for 14 days
    })
  ]
});

module.exports = logger;