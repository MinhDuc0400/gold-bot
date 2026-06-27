import axios from 'axios';
import { SJCPrice } from '../types';
import { config } from '../config';
import { logger } from '../utils/logger';

export async function fetchVNGoldPrice(): Promise<SJCPrice> {
  const response = await axios.get(config.tygiausd.url, {
    timeout: 7_000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; gold-bot/1.0)' },
    responseType: 'text',
  });

  const html: string = response.data;

  // Find the "Vàng miếng SJC" row and extract the two td values after it
  const rowMatch = html.match(
    /Vàng miếng SJC[\s\S]*?<td[^>]*class="text-right"[^>]*>\s*([\d,]+)/
  );

  if (!rowMatch) {
    throw new Error('Vàng miếng SJC row not found on tygiausd page');
  }

  // Grab both td values (buy, sell) from the row block
  const rowBlock = html.slice(html.indexOf('Vàng miếng SJC'));
  const tdMatches = rowBlock.match(/<td[^>]*class="text-right"[^>]*>\s*([\d,]+)/g);

  if (!tdMatches || tdMatches.length < 2) {
    throw new Error('Could not find buy/sell prices in Vàng miếng SJC row');
  }

  const extractNum = (s: string) => parseInt(s.replace(/[^\d]/g, ''), 10);
  const sellRaw = extractNum(tdMatches[1]);

  if (!sellRaw || sellRaw < 10_000) {
    throw new Error(`Unexpected sell price value: ${sellRaw}`);
  }

  // Page displays prices in 1,000 VND units per cây (e.g. 168,800 → 168,800,000 VND/cây)
  const sellPrice = sellRaw * 1_000;

  logger.info(`✓ tygiausd SJC sell: ${sellRaw.toLocaleString()} (×1000) = ${sellPrice.toLocaleString()} VND/cây`);

  return {
    source: 'sjc',
    sellPrice,
    timestamp: new Date(),
    url: config.tygiausd.url,
  };
}
