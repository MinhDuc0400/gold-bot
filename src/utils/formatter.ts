import { GoldData } from '../types';
import { config } from '../config';

export function formatGoldMessage(data: GoldData): string {
  const vnCay = data.vnPrice.buyPrice / config.conversion.luongToCay;
  const worldCay = (data.worldPrice.spotPrice * data.exchangeRate) / config.conversion.ozToCay;

  const delta = vnCay - worldCay;
  const deltaPct = ((delta / worldCay) * 100).toFixed(1);
  const trendEmoji = delta > 0 ? '📈' : '📉';
  const deltaSign = delta > 0 ? '+' : '';

  const fmt = (n: number) => Math.round(n).toLocaleString('vi-VN');

  return `
🏆 GIÁ VÀNG HÔM NAY
━━━━━━━━━━━━━━━━━━
🇻🇳 Vàng SJC: ${fmt(vnCay)} VND/cây
🌍 Vàng TG: ${fmt(worldCay)} VND/cây
━━━━━━━━━━━━━━━━━━
📊 Chênh lệch: ${trendEmoji} ${fmt(Math.abs(delta))} VND/cây
   (${deltaSign}${deltaPct}%)

💱 Tỷ giá: ${fmt(data.exchangeRate)} VND/USD
📍 Nguồn: SJC, ${data.worldPrice.source}

⏰ ${new Date().toLocaleString('vi-VN')}
  `.trim();
}
