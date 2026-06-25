import axios from 'axios';
import { Browser } from 'playwright';
import { WorldGoldPrice } from '../types';
import { config } from '../config';
import { logger } from '../utils/logger';

async function fetchMetalsLive(): Promise<WorldGoldPrice | null> {
  try {
    const response = await axios.get(config.metals.url, {
      timeout: config.metals.timeout,
    });

    const spotPrice = response.data?.spot?.gold as number | undefined;

    if (!spotPrice || spotPrice < 1000) {
      throw new Error(`Invalid gold price from metals.live: ${spotPrice}`);
    }

    logger.info(`✓ metals.live: ${spotPrice} USD/oz`);

    return {
      spotPrice: parseFloat(String(spotPrice)),
      timestamp: new Date(),
      source: 'metals.live',
    };
  } catch (error) {
    logger.warn(`metals.live API failed: ${(error as Error).message}`);
    return null;
  }
}

async function fetchTradingView(browser: Browser): Promise<WorldGoldPrice | null> {
  const page = await browser.newPage();

  try {
    logger.info('Trying TradingView fallback...');

    await page.goto(config.tradingview.url, {
      waitUntil: 'networkidle',
      timeout: config.scraping.timeout,
    });

    await page.waitForSelector('span', { timeout: 10_000 });

    let priceText = await page.locator('[class*="lastPrice"]').first().textContent().catch(() => null);

    if (!priceText) {
      priceText = await page.locator('span[class*="price"]').first().textContent().catch(() => null);
    }

    const match = priceText?.match(/[\d,]+\.?\d*/)?.[0];
    const spotPrice = parseFloat((match ?? '').replace(/,/g, ''));

    if (!spotPrice || spotPrice < 1000) {
      throw new Error(`Invalid TradingView price: ${spotPrice}`);
    }

    logger.info(`✓ TradingView: ${spotPrice} USD/oz`);

    return {
      spotPrice,
      timestamp: new Date(),
      source: 'tradingview',
    };
  } catch (error) {
    logger.warn(`TradingView scrape failed: ${(error as Error).message}`);
    return null;
  } finally {
    await page.close();
  }
}

export async function fetchWorldGoldPrice(browser: Browser): Promise<WorldGoldPrice> {
  const result = await fetchMetalsLive();
  if (result) return result;

  logger.info('Primary source failed, trying TradingView fallback...');
  const fallback = await fetchTradingView(browser);
  if (fallback) return fallback;

  throw new Error('All world gold sources exhausted');
}
