"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const telegram_1 = require("../src/bot/telegram");
async function handler(req, res) {
    // Vercel sends CRON_SECRET as Bearer token — verify it
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        await (0, telegram_1.sendDailyNotification)();
        res.status(200).json({ ok: true });
    }
    catch (error) {
        console.error('Cron error:', error);
        res.status(500).json({ error: String(error) });
    }
}
//# sourceMappingURL=cron.js.map