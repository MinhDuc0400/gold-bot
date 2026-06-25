# How to Get Your Tokens & Keys

You need two values before running the bot: a **Telegram Bot Token** and your **Telegram Chat ID**.

---

## 1. Telegram Bot Token

This is the credential that lets your code control the bot.

**Steps:**

1. Open Telegram and search for **@BotFather** (official bot, blue checkmark)
2. Start a chat and send:
   ```
   /newbot
   ```
3. BotFather will ask for a **name** (display name, e.g. `Gold Price Bot`)
4. Then ask for a **username** (must end in `bot`, e.g. `mygoldprice_bot`)
5. BotFather replies with your token:
   ```
   Done! Use this token to access the HTTP API:
   123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

6. Copy that token into your `.env`:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

> **Keep this secret.** Anyone with your token can control your bot.

---

## 2. Telegram Chat ID

This tells the bot which conversation to send the daily notification to.
The easiest way is to use your personal chat with the bot.

**Steps:**

1. Search for **@userinfobot** on Telegram
2. Start a chat and send:
   ```
   /start
   ```
3. It replies with your user info:
   ```
   Id: 123456789
   First: John
   ...
   ```
4. Copy the **Id** number into your `.env`:
   ```env
   TELEGRAM_CHAT_ID=123456789
   ```

> This is your personal Telegram user ID. The bot will send notifications directly to your private chat.

---

## 3. Activate the Bot

Before the bot can message you, you must start a conversation with it first.

1. Search for your bot by the username you chose (e.g. `@mygoldprice_bot`)
2. Click **Start** or send `/start`

Without this step, Telegram blocks the bot from messaging you.

---

## Final .env File

```env
TELEGRAM_BOT_TOKEN=123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_CHAT_ID=123456789
USD_TO_VND_RATE=26500
CRON_TIME=0 8 * * *
TIMEZONE=Asia/Ho_Chi_Minh
LOG_LEVEL=info
SCRAPE_TIMEOUT=15000
BROWSER_HEADLESS=true
```

---

## Quick Verification

Once the bot is running, send `/gold` to your bot on Telegram.
If it replies with a price table, everything is wired up correctly.
