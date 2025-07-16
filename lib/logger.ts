import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export function createLogger(service: string) {
  return {
    info: (message: string, meta?: Record<string, unknown>) => {
      logger.info(message, { service, ...meta });
    },
    error: (message: string, meta?: Record<string, unknown>) => {
      logger.error(message, { service, ...meta });
    },
    warn: (message: string, meta?: Record<string, unknown>) => {
      logger.warn(message, { service, ...meta });
    },
    debug: (message: string, meta?: Record<string, unknown>) => {
      logger.debug(message, { service, ...meta });
    },
  };
} 