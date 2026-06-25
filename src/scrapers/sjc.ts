import { Browser } from 'playwright';
import { SJCPrice } from '../types';
import { config } from '../config';
import { logger } from '../utils/logger';
import { parsePrice } from '../utils/parser';

export async function fetchSJCPrice(browser: Browser): Promise<SJCPrice> {
  const page = await browser.newPage();

  try {
    logger.info('Fetching SJC gold price...');

    await page.goto(config.sjc.url, {
      waitUntil: 'networkidle',
      timeout: config.scraping.timeout,
    });

    await page.waitForSelector('table', { timeout: 10_000 });

    const buyText = await page
      .locator('xpath=//tr[contains(., "Vàng miếng")]//td[2]')
      .first()
      .textContent();

    if (!buyText) {
      throw new Error('Could not locate SJC buy price element');
    }

    const buyPrice = parsePrice(buyText);

    if (!buyPrice || buyPrice < config.sjc.minValidPrice) {
      throw new Error(`Invalid SJC price parsed: ${buyPrice}`);
    }

    logger.info(`✓ SJC buy price: ${buyPrice} VND/lượng`);

    return {
      source: 'sjc',
      buyPrice,
      timestamp: new Date(),
      url: config.sjc.url,
    };
  } catch (error) {
    logger.error(`✗ SJC scrape failed: ${(error as Error).message}`);
    throw error;
  } finally {
    await page.close();
  }
}
