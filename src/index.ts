import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot/telegram';
import { startScheduler } from './scheduler/cron';
import { logger } from './utils/logger';

async function main() {
  try {
    logger.info('=== Gold Price Bot Starting ===');
    logger.info(`Bot token: ${process.env.TELEGRAM_BOT_TOKEN?.slice(0, 10)}...`);
    logger.info(`Chat ID: ${process.env.TELEGRAM_CHAT_ID}`);

    startScheduler();

    await bot.launch();
    logger.info('✓ Bot launched');

    process.once('SIGINT', () => {
      logger.info('SIGINT received, gracefully stopping...');
      bot.stop('SIGINT');
    });

    process.once('SIGTERM', () => {
      logger.info('SIGTERM received, gracefully stopping...');
      bot.stop('SIGTERM');
    });
  } catch (error) {
    logger.error(`Failed to start bot: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
