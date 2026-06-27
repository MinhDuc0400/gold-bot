import axios from 'axios';
import { SJCPrice } from '../types';
import { config } from '../config';
import { logger } from '../utils/logger';

const TARGET_ROW = 'Phú Qúy SJC';

export async function fetchVNGoldPrice(): Promise<SJCPrice> {
  const response = await axios.get(config.tygiausd.url, {
    timeout: 7_000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; gold-bot/1.0)' },
    responseType: 'text',
  });

  const html: string = response.data;

  const rowIdx = html.indexOf(TARGET_ROW);
  if (rowIdx === -1) {
    throw new Error(`"${TARGET_ROW}" row not found on tygiausd page`);
  }

  // Slice from the row header and grab the next two td.text-right values (buy, sell)
  const rowBlock = html.slice(rowIdx);
  const tdMatches = rowBlock.match(/<td[^>]*class="text-right"[^>]*>\s*([\d,]+)/g);

  if (!tdMatches || tdMatches.length < 2) {
    throw new Error(`Could not find buy/sell prices in "${TARGET_ROW}" row`);
  }

  const extractNum = (s: string) => parseInt(s.replace(/[^\d]/g, ''), 10);
  const buyRaw = extractNum(tdMatches[0]);
  const sellRaw = extractNum(tdMatches[1]);

  if (!buyRaw || buyRaw < 10_000 || !sellRaw || sellRaw < 10_000) {
    throw new Error(`Unexpected price values: buy=${buyRaw} sell=${sellRaw}`);
  }

  // Page displays prices in 1,000 VND units per cây (e.g. 148,500 → 148,500,000 VND/cây)
  const buyPrice = buyRaw * 1_000;
  const sellPrice = sellRaw * 1_000;

  logger.info(`✓ tygiausd ${TARGET_ROW}: buy=${buyRaw.toLocaleString()} sell=${sellRaw.toLocaleString()} (×1000 VND/cây)`);

  return {
    source: 'sjc',
    buyPrice,
    sellPrice,
    timestamp: new Date(),
    url: config.tygiausd.url,
  };
}
