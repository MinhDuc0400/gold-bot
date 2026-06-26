import pino from 'pino';

// Vercel captures stdout automatically — no file streaming needed
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
});
