export interface SJCPrice {
  source: 'sjc';
  sellPrice: number;   // VND/cây
  timestamp: Date;
  url: string;
}

export interface WorldGoldPrice {
  askPrice: number;    // USD/oz
  timestamp: Date;
  source: 'goldapi' | 'yahoo' | 'tradingview';
}

export interface GoldData {
  vnPrice: {
    sellPrice: number; // VND/cây
    source: 'sjc';
  } | null;            // null when BTMC is unreachable
  worldPrice: {
    askPrice: number;  // USD/oz
    source: 'goldapi' | 'yahoo' | 'tradingview';
  };
  exchangeRate: number; // VND/USD
  timestamp: Date;
}
