export const config = {
  sjc: {
    url: 'https://sjc.com.vn/',
    minValidPrice: 100_000_000,
  },
  metals: {
    url: 'https://api.metals.live/v1/spot/gold',
    timeout: 10_000,
  },
  tradingview: {
    url: 'https://www.tradingview.com/symbols/XAUUSD/',
  },
  conversion: {
    luongToCay: 10,
    ozToCay: 8.294,
    defaultUsdToVnd: 26_500,
  },
  scraping: {
    timeout: parseInt(process.env.SCRAPE_TIMEOUT ?? '15000'),
    headless: process.env.BROWSER_HEADLESS !== 'false',
    retries: 2,
    retryDelayMs: 5_000,
  },
  cron: {
    time: process.env.CRON_TIME ?? '0 8 * * *',
    timezone: process.env.TIMEZONE ?? 'Asia/Ho_Chi_Minh',
  },
};
