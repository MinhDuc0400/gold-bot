import pino from 'pino';
import fs from 'fs';
import path from 'path';

const logsDir = path.resolve('./logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream([
    { stream: pino.destination({ dest: path.join(logsDir, 'bot.log'), sync: false }) },
    {
      stream: (await import('pino-pretty')).default({
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      }),
    },
  ])
);
