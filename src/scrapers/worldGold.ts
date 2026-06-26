import axios from 'axios';
import { WorldGoldPrice } from '../types';
import { config } from '../config';
import { logger } from '../utils/logger';

async function fetchGoldAPI(): Promise<WorldGoldPrice | null> {
  try {
    const response = await axios.get(config.goldapi.url, {
      timeout: 5_000,
      headers: {
        'x-access-token': config.goldapi.key,
        'Content-Type': 'application/json',
      },
    });

    // Use ask price = giá bán ra (what you pay to buy gold)
    const askPrice = response.data?.ask as number | undefined;
    const fallbackPrice = response.data?.price as number | undefined;
    const price = askPrice ?? fallbackPrice;

    if (!price || price < 1000) {
      throw new Error(`Invalid ask price from GoldAPI: ${price}`);
    }

    logger.info(`✓ GoldAPI ask: ${price} USD/oz`);

    return {
      askPrice: price,
      timestamp: new Date(),
      source: 'goldapi',
    };
  } catch (error) {
    logger.warn(`GoldAPI failed: ${(error as Error).message}`);
    return null;
  }
}

async function fetchYahooFinance(): Promise<WorldGoldPrice | null> {
  try {
    const response = await axios.get(
      'https://query1.finance.yahoo.com/v8/finance/chart/GC=F',
      {
        timeout: 10_000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }
    );

    // Yahoo has no bid/ask in this endpoint — regularMarketPrice is close enough
    const price = response.data?.chart?.result?.[0]?.meta?.regularMarketPrice as number | undefined;

    if (!price || price < 1000) {
      throw new Error(`Invalid price from Yahoo Finance: ${price}`);
    }

    logger.info(`✓ Yahoo Finance (GC=F): ${price} USD/oz`);

    return {
      askPrice: price,
      timestamp: new Date(),
      source: 'yahoo',
    };
  } catch (error) {
    logger.warn(`Yahoo Finance failed: ${(error as Error).message}`);
    return null;
  }
}

export async function fetchWorldGoldPrice(): Promise<WorldGoldPrice> {
  const result = await fetchGoldAPI();
  if (result) return result;

  logger.info('GoldAPI failed, trying Yahoo Finance fallback...');
  const fallback = await fetchYahooFinance();
  if (fallback) return fallback;

  throw new Error('All world gold sources exhausted');
}
