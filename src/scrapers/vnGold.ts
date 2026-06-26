import axios from 'axios';
import { SJCPrice } from '../types';
import { config } from '../config';
import { logger } from '../utils/logger';

export async function fetchVNGoldPrice(): Promise<SJCPrice> {
  const response = await axios.get(config.btmc.url, { timeout: 7_000 });
  const items: Record<string, string>[] = response.data?.DataList?.Data ?? [];

  for (const item of items) {
    const row = item['@row'];
    const name: string = item[`@n_${row}`] ?? '';
    const sellRaw: string = item[`@ps_${row}`] ?? '';

    if (name.toUpperCase().includes('VÀNG MIẾNG SJC') && sellRaw) {
      const pricePerChi = parseInt(sellRaw, 10);
      if (pricePerChi > 1_000_000) {
        // BTMC returns VND/chỉ → ×10 to get VND/cây (1 cây = 10 chỉ)
        const sellPrice = pricePerChi * 10;
        logger.info(`✓ BTMC SJC sell: ${pricePerChi.toLocaleString()} VND/chỉ = ${sellPrice.toLocaleString()} VND/cây`);
        return {
          source: 'sjc',
          sellPrice,
          timestamp: new Date(),
          url: config.btmc.url,
        };
      }
    }
  }

  throw new Error('VÀNG MIẾNG SJC not found in BTMC response');
}
