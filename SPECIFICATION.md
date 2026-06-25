# Gold Price Tracker Bot — Specification

See the full specification in the project brief. This file is the canonical implementation reference.

Quick links to key sections:
- Data sources: SJC (Playwright), metals.live API, TradingView fallback
- Architecture: getData() orchestrator → formatter → Telegram
- Scheduler: node-cron daily at 08:00 Asia/Ho_Chi_Minh
- Deployment: Railway (recommended)

Refer to README.md for quick-start and src/ for implementation.
