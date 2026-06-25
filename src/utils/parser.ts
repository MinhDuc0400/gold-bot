export function parsePrice(text: string): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d]/g, '');
  const price = parseInt(cleaned, 10);
  return isNaN(price) ? null : price;
}
