export const config = {
  sjc: {
    url: 'https://sjc.com.vn/',
    minValidPricePerLuong: 100_000_000, // VND/lượng sanity check for scrape
    minValidPricePerCay: 10_000_000,    // VND/cây sanity check
  },
  btmc: {
    url: 'http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3kd8ub1llcg9t45hnoh8hmn7t5kc2v',
  },
  vietcombank: {
    url: 'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=68',
  },
  goldapi: {
    url: 'https://www.goldapi.io/api/XAU/USD',
    key: process.env.GOLDAPI_KEY ?? '',
    timeout: 10_000,
  },
  conversion: {
    luongToCay: 10,
    ozToCay: 0.8294,  // 1 troy oz = 31.1g, 1 cây = 37.5g → 31.1/37.5 = 0.8294
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
