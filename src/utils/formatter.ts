import { GoldData } from '../types';
import { config } from '../config';

export function formatGoldMessage(data: GoldData): string {
  const worldCay = (data.worldPrice.askPrice * data.exchangeRate) / config.conversion.ozToCay;
  const fmt = (n: number) => Math.round(n).toLocaleString('vi-VN');

  let vnLine = '🇻🇳 Vàng SJC: N/A (nguồn đang bảo trì)';
  let deltaLine = '📊 Chênh lệch: N/A';

  if (data.vnPrice) {
    const vnCay = data.vnPrice.sellPrice;
    const delta = vnCay - worldCay;
    const deltaPct = ((delta / worldCay) * 100).toFixed(1);
    const trendEmoji = delta > 0 ? '📈' : '📉';
    const deltaSign = delta > 0 ? '+' : '';

    vnLine = `🇻🇳 Vàng SJC: Mua ${fmt(data.vnPrice.buyPrice)} / Bán ${fmt(vnCay)} VND/cây`;
    deltaLine = `📊 Chênh lệch: ${trendEmoji} ${fmt(Math.abs(delta))} VND/cây\n   (${deltaSign}${deltaPct}%)`;
  }

  return `
🏆 GIÁ VÀNG HÔM NAY (Giá bán ra)
━━━━━━━━━━━━━━━━━━
${vnLine}
🌍 Vàng TG: ${fmt(worldCay)} VND/cây (${data.worldPrice.askPrice.toFixed(0)} USD/oz)
━━━━━━━━━━━━━━━━━━
${deltaLine}

💱 Tỷ giá: ${fmt(data.exchangeRate)} VND/USD
📍 Nguồn: tygiausd/SJC, ${data.worldPrice.source}

⏰ ${new Date().toLocaleString('vi-VN')}
  `.trim();
}
