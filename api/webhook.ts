import type { VercelRequest, VercelResponse } from '@vercel/node';
import { bot } from '../src/bot/telegram';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(200).json({ status: 'webhook active' });
    return;
  }

  try {
    await bot.handleUpdate(req.body);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(200).json({ ok: false }); // always 200 to Telegram
  }
}
