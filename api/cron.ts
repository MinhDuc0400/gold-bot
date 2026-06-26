import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendDailyNotification } from '../src/bot/telegram';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Vercel sends CRON_SECRET as Bearer token — verify it
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    await sendDailyNotification();
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Cron error:', error);
    res.status(500).json({ error: String(error) });
  }
}
