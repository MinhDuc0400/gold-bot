# Gold Price Tracker Bot

Telegram bot that fetches Vietnam (SJC) and world gold prices daily and sends a formatted comparison message.

## Quick Start

```bash
git clone <repo-url>
cd gold-bot
npm install
cp .env.example .env
# Edit .env with your Telegram bot token and chat ID
npm run dev
```

## Commands

| Command   | Description                      |
|-----------|----------------------------------|
| `/gold`   | Fetch and display current prices |
| `/status` | Show bot status                  |
| `/help`   | List available commands          |

## Environment Variables

See [.env.example](.env.example) for all required variables.

Key values to set:
- `TELEGRAM_BOT_TOKEN` — from [@BotFather](https://t.me/BotFather)
- `TELEGRAM_CHAT_ID` — from [@userinfobot](https://t.me/userinfobot)
- `USD_TO_VND_RATE` — current exchange rate (default: 26500)

## Scripts

```bash
npm run dev      # Run with ts-node (development)
npm run build    # Compile TypeScript → dist/
npm start        # Run compiled output
npm test         # Run jest tests
```

## Deployment (Railway)

1. Push repo to GitHub
2. Create project on [Railway](https://railway.app) from the GitHub repo
3. Add environment variables in Railway dashboard
4. Railway auto-builds and deploys on push

## Data Sources

| Source | Type | Unit |
|--------|------|------|
| [sjc.com.vn](https://sjc.com.vn/) | Playwright scrape | VND/lượng |
| [metals.live](https://api.metals.live/v1/spot/gold) | REST API (primary) | USD/oz |
| [TradingView XAUUSD](https://www.tradingview.com/symbols/XAUUSD/) | Playwright scrape (fallback) | USD/oz |

## Unit Conversions

- 1 lượng = 10 cây
- 1 oz = 8.294 cây
- World price (VND/cây) = `spotPrice × exchangeRate / 8.294`

## Example Output

```
🏆 GIÁ VÀNG HÔM NAY
━━━━━━━━━━━━━━━━━━
🇻🇳 Vàng SJC: 15,500,000 VND/cây
🌍 Vàng TG: 12,993,661 VND/cây
━━━━━━━━━━━━━━━━━━
📊 Chênh lệch: 📈 2,506,339 VND/cây
   (+19.3%)

💱 Tỷ giá: 26,500 VND/USD
📍 Nguồn: SJC, metals.live

⏰ 24/6/2026, 08:05:30
```

## Project Structure

```
src/
├── config.ts              # Constants and config
├── types.ts               # TypeScript interfaces
├── index.ts               # Entry point
├── bot/telegram.ts        # Bot commands and notifications
├── scrapers/
│   ├── index.ts           # getData() orchestrator
│   ├── sjc.ts             # SJC Playwright scraper
│   └── worldGold.ts       # metals.live + TradingView fallback
├── utils/
│   ├── formatter.ts       # Message formatting
│   ├── logger.ts          # pino logger
│   └── parser.ts          # Number parsing
└── scheduler/cron.ts      # Daily cron (08:00 AM VN time)
```

See [SPECIFICATION.md](SPECIFICATION.md) for full implementation details.
