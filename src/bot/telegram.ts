import { Telegraf } from 'telegraf';
import { getData } from '../scrapers';
import { formatGoldMessage } from '../utils/formatter';
import { logger } from '../utils/logger';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.command('gold', async (ctx) => {
  try {
    logger.info(`/gold command from user ${ctx.from?.id}`);
    await ctx.sendChatAction('typing');

    const data = await getData();
    const message = formatGoldMessage(data);

    await ctx.reply(message);
  } catch (error) {
    const msg = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    await ctx.reply(msg);
    logger.error(`/gold command failed: ${error}`);
  }
});

bot.command('help', (ctx) => {
  ctx.reply(
    `📊 *Gold Price Tracker Bot*\n\nCommands:\n/gold - Get current gold prices\n/status - Check bot status\n/help - Show this message\n\nThe bot automatically sends daily notification at 08:00 AM Vietnam time.`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('status', (ctx) => {
  ctx.reply('✅ Bot is running\n⏰ Next notification: 08:00 AM Vietnam time');
});

bot.catch((err, ctx) => {
  logger.error(`Telegram error for update ${ctx.updateType}: ${(err as Error).message}`);
});

export async function sendDailyNotification(): Promise<void> {
  const chatId = parseInt(process.env.TELEGRAM_CHAT_ID!);

  try {
    logger.info('=== Daily notification started ===');

    const data = await getData();
    const message = formatGoldMessage(data);

    await bot.telegram.sendMessage(chatId, message);

    logger.info('✓ Daily notification sent successfully');
  } catch (error) {
    logger.error(`✗ Daily notification failed: ${(error as Error).message}`);

    try {
      await bot.telegram.sendMessage(
        chatId,
        `⚠️ Gold bot error:\n${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } catch (sendErr) {
      logger.error(`Failed to send error alert: ${sendErr}`);
    }
  }
}

export { bot };
