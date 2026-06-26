import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

async function fetchVietcombank(): Promise<number | null> {
  try {
    const response = await axios.get(config.vietcombank.url, {
      timeout: 10_000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    // Parse <Exrate CurrencyCode="USD" ... Transfer="26,114.00" ... />
    const match = response.data.match(
      /CurrencyCode="USD"[^>]*Transfer="([\d,]+\.?\d*)"/
    );

    if (!match) throw new Error('USD rate not found in Vietcombank XML');

    const rate = parseFloat(match[1].replace(/,/g, ''));
    if (!rate || rate < 20_000) throw new Error(`Invalid rate: ${rate}`);

    logger.info(`✓ Vietcombank USD/VND: ${rate.toLocaleString()}`);
    return rate;
  } catch (error) {
    logger.warn(`Vietcombank rate failed: ${(error as Error).message}`);
    return null;
  }
}

export async function fetchExchangeRate(): Promise<number> {
  const live = await fetchVietcombank();
  if (live) return live;

  // Fallback to .env value
  const envRate = parseInt(process.env.USD_TO_VND_RATE ?? '0', 10);
  if (envRate > 20_000) {
    logger.info(`Using .env fallback rate: ${envRate}`);
    return envRate;
  }

  logger.warn('No exchange rate available, using default 26500');
  return config.conversion.defaultUsdToVnd;
}
