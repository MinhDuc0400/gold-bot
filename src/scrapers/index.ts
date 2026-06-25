import { chromium } from 'playwright';
import { GoldData } from '../types';
import { config } from '../config';
import { logger } from '../utils/logger';
import { fetchSJCPrice } from './sjc';
import { fetchWorldGoldPrice } from './worldGold';

async function retryFetch<T>(
  fn: () => Promise<T>,
  maxRetries = config.scraping.retries,
  delayMs = config.scraping.retryDelayMs
): Promise<T> {
  let lastError: Error = new Error('Unknown error');
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        logger.warn(`Retry ${i + 1}/${maxRetries} after ${delayMs}ms — ${lastError.message}`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastError;
}

export async function getData(): Promise<GoldData> {
  const browser = await chromium.launch({ headless: config.scraping.headless });

  try {
    logger.info('=== Starting data fetch ===');

    const [sjcResult, worldResult] = await Promise.all([
      retryFetch(() => fetchSJCPrice(browser)),
      fetchWorldGoldPrice(browser),
    ]);

    const exchangeRate = parseInt(process.env.USD_TO_VND_RATE ?? String(config.conversion.defaultUsdToVnd), 10);

    const data: GoldData = {
      vnPrice: { buyPrice: sjcResult.buyPrice, source: 'sjc' },
      worldPrice: { spotPrice: worldResult.spotPrice, source: worldResult.source },
      exchangeRate,
      timestamp: new Date(),
    };

    logger.info('✓ All data fetched successfully');
    return data;
  } catch (error) {
    logger.error(`✗ Data fetch failed: ${(error as Error).message}`);
    throw error;
  } finally {
    await browser.close();
  }
}
