"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const telegram_1 = require("../src/bot/telegram");
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(200).json({ status: 'webhook active' });
    }
    try {
        await telegram_1.bot.handleUpdate(req.body);
        res.status(200).json({ ok: true });
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.status(200).json({ ok: false }); // always 200 to Telegram
    }
}
//# sourceMappingURL=webhook.js.map