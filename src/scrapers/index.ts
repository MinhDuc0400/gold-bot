import { GoldData } from '../types';
import { logger } from '../utils/logger';
import { fetchVNGoldPrice } from './vnGold';
import { fetchWorldGoldPrice } from './worldGold';
import { fetchExchangeRate } from './exchange';

export async function getData(): Promise<GoldData> {
  logger.info('=== Starting data fetch ===');

  // VN price has a hard 6s budget — if BTMC is slow, skip it rather than timing out Vercel
  const vnPromise = Promise.race([
    fetchVNGoldPrice().catch((e) => {
      logger.warn(`VN gold unavailable: ${e.message}`);
      return null;
    }),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), 6_000)),
  ]);

  const [vnResult, worldResult, exchangeRate] = await Promise.all([
    vnPromise,
    fetchWorldGoldPrice(),
    fetchExchangeRate(),
  ]);

  const data: GoldData = {
    vnPrice: vnResult ? { buyPrice: vnResult.buyPrice, sellPrice: vnResult.sellPrice, source: 'sjc' } : null,
    worldPrice: { askPrice: worldResult.askPrice, source: worldResult.source },
    exchangeRate,
    timestamp: new Date(),
  };

  logger.info(`✓ Data fetched — VN: ${vnResult ? 'ok' : 'unavailable'}`);
  return data;
}
