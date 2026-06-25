export interface SJCPrice {
  source: 'sjc';
  buyPrice: number;
  timestamp: Date;
  url: string;
}

export interface WorldGoldPrice {
  spotPrice: number;
  timestamp: Date;
  source: 'metals.live' | 'tradingview';
}

export interface GoldData {
  vnPrice: {
    buyPrice: number;
    source: 'sjc';
  };
  worldPrice: {
    spotPrice: number;
    source: 'metals.live' | 'tradingview';
  };
  exchangeRate: number;
  timestamp: Date;
}
