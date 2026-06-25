import cron from 'node-cron';
import { sendDailyNotification } from '../bot/telegram';
import { config } from '../config';
import { logger } from '../utils/logger';

export function startScheduler(): void {
  const job = cron.schedule(
    config.cron.time,
    async () => {
      try {
        await sendDailyNotification();
      } catch (error) {
        logger.error(`Cron job failed: ${(error as Error).message}`);
      }
    },
    { timezone: config.cron.timezone }
  );

  logger.info('✓ Cron scheduler started');
  logger.info(`  Scheduled: ${config.cron.time} (${config.cron.timezone})`);

  // Log next run via node-cron's nextDate if available
  const next = (job as unknown as { nextDate?: () => Date }).nextDate?.();
  if (next) logger.info(`  Next run: ${next.toLocaleString('vi-VN')}`);
}
