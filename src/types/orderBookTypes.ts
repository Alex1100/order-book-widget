export type Side = "bids" | "asks";
export type OrderSide = "bid" | "ask";
export type RawLevel = {px: string, sz: string; };

export type Flash = "up" | "down" | null;

export type OrderBookLevel = {
  key: string;
  side: Side;
  price: number;
  size: number;
  total: number;
  depth: number;
  notional: number;
};

export type BookLevel = {
  price: number;
  size: number;
  total: number;
  depthRatio: number;
  flash?: "up" | "down" | null;
};

export type OrderBookSnapshot = {
  bids: BookLevel[];
  asks: BookLevel[];
  bestBid: number | null;
  bestAsk: number | null;
  spread: number | null;
  mid: number | null;
  seq: number;
  symbol: string;
  nSigFigs: number;
  grouping: number;
  isConnected: boolean;
};

export type OrderBookConfig = {
  symbol: string;
  nSigFigs: number;
  grouping: number;
  visibleLevels: number;
};

export type HyperliquidBookMessage = {
  channel: "l2Book";
  data: {
    coin: string;
    levels: RawLevel[][];
    time?: number;
  };
};