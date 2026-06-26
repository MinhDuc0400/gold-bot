import { GoldData } from '../types';
import { logger } from '../utils/logger';
import { fetchVNGoldPrice } from './vnGold';
import { fetchWorldGoldPrice } from './worldGold';
import { fetchExchangeRate } from './exchange';

export async function getData(): Promise<GoldData> {
  logger.info('=== Starting data fetch ===');

  const [vnResult, worldResult, exchangeRate] = await Promise.all([
    fetchVNGoldPrice(),
    fetchWorldGoldPrice(),
    fetchExchangeRate(),
  ]);

  const data: GoldData = {
    vnPrice: { sellPrice: vnResult.sellPrice, source: 'sjc' },
    worldPrice: { askPrice: worldResult.askPrice, source: worldResult.source },
    exchangeRate,
    timestamp: new Date(),
  };

  logger.info('✓ All data fetched successfully');
  return data;
}
