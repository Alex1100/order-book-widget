import type {
  BookLevel,
  OrderBookConfig,
  OrderBookSnapshot,
  RawLevel,
} from "../types/orderBookTypes";
type Listener = () => void;

function roundToSigFigs(value: number, sigFigs: number): number {
  if (!Number.isFinite(value) || value === 0) return value;
  return Number.parseFloat(value.toPrecision(sigFigs));
}

function roundToStep(price: number, step: number, side: "bid" | "ask"): number {
  if (step <= 0) return price;
  const units = price / step;
  const roundedUnits = side === "bid" ? Math.floor(units + 1e-9) : Math.ceil(units - 1e-9);
  return roundedUnits * step;
}

export class OrderBookStore {
  private bids = new Map<number, number>();
  private asks = new Map<number, number>();

  private listeners = new Set<Listener>();
  private scheduled = false;

  private config: OrderBookConfig = {
    symbol: "BTC",
    nSigFigs: 5,
    grouping: 0.5,
    visibleLevels: 12,
  };

  private isConnected = false;
  private seq = 0;
  private previousBids = new Map<number, number>();
  private previousAsks = new Map<number, number>();

  private snapshot: OrderBookSnapshot = {
    bids: [],
    asks: [],
    bestBid: null,
    bestAsk: null,
    spread: null,
    mid: null,
    seq: 0,
    symbol: "BTC",
    nSigFigs: 5,
    grouping: 0.5,
    isConnected: false,
  };

private addFlashIndicators(
    levels: BookLevel[],
    previousLevels: Map<number, number>,
    side: "bids" | "asks"
  ): BookLevel[] {
    return levels.map(level => {
      const previousSize = previousLevels.get(level.price);
      let flash: "up" | "down" | null = null;

      if (previousSize === undefined) {
        // New price level
        flash = side === "bids" ? "up" : "down";
      } else if (level.size !== previousSize) {
        // Size changed
        flash = level.size > previousSize ? "up" : "down";
      }

      return { ...level, flash };
    });
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.snapshot;

  setConnectionStatus(isConnected: boolean) {
    if (this.isConnected === isConnected) return;
    this.isConnected = isConnected;
    this.schedulePublish();
  }

  setConfig(next: Partial<OrderBookConfig>) {
    this.config = { ...this.config, ...next };
    this.schedulePublish();
  }

  resetBook() {
    this.bids.clear();
    this.asks.clear();
    this.seq += 1;
    this.schedulePublish();
  }

  replaceBook(levels: RawLevel[][]) {
    this.bids.clear();
    this.asks.clear();
    this.applyLevels("bids", levels[0]);
    this.applyLevels("asks", levels[1]);

    this.seq += 1;
    this.schedulePublish();
  }

  applyDeltaLevels(levels: RawLevel[][]) {
    this.applyLevels("bids", levels[0]);
    this.applyLevels("asks", levels[1]);

    this.seq += 1;
    this.schedulePublish();
  }

  private applyLevels(side: "bids" | "asks", updates: RawLevel[]) {
    const target = side === "bids" ? this.bids : this.asks;
    const sigFigs = this.config.nSigFigs;

    for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const {px, sz} = update;
        const price = roundToSigFigs(Number(px), sigFigs);
        const size = Number(sz);
        if (!Number.isFinite(price) || !Number.isFinite(size)) {
            continue;
        }

        if (size === 0) {
            target.delete(price);
        } else {
            target.set(price, size);
        }
    };

  }

  private schedulePublish() {
    if (this.scheduled) return;
    this.scheduled = true;

    queueMicrotask(() => {
      this.scheduled = false;
      this.publish();
    });
  }

  private publish() {
    const bids = this.buildSide(this.bids, "desc");
    const asks = this.buildSide(this.asks, "asc");

    // Add flash indicators for changed levels
    const bidsWithFlash = this.addFlashIndicators(bids, this.previousBids, "bids");
    const asksWithFlash = this.addFlashIndicators(asks, this.previousAsks, "asks");

    // Store only the visible grouped levels for next comparison
    this.previousBids = new Map(bids.map(l => [l.price, l.size]));
    this.previousAsks = new Map(asks.map(l => [l.price, l.size]));

    const bestBid = bids[0]?.price ?? null;
    const bestAsk = asks[0]?.price ?? null;

    const spread =
      bestBid != null && bestAsk != null ? bestAsk - bestBid : null;

    const mid =
      bestBid != null && bestAsk != null ? (bestBid + bestAsk) / 2 : null;

    const nextSnapshot: OrderBookSnapshot = {
      bids: bidsWithFlash,
      asks: asksWithFlash,
      bestBid,
      bestAsk,
      spread,
      mid,
      seq: this.seq,
      symbol: this.config.symbol,
      nSigFigs: this.config.nSigFigs,
      grouping: this.config.grouping,
      isConnected: this.isConnected,
    };

    this.snapshot = nextSnapshot;
    this.listeners.forEach((listener) => listener());
  }

  private buildSide(
    levelsMap: Map<number, number>,
    order: "asc" | "desc",
  ): BookLevel[] {
    // Group prices by the grouping step
    const grouped = new Map<number, number>();
    const grouping = this.config.grouping;

    for (const [price, size] of levelsMap.entries()) {
      const groupedPrice = roundToStep(
        roundToSigFigs(price, this.config.nSigFigs),
        grouping,
        order === "desc" ? "bid" : "ask"
      );
      grouped.set(groupedPrice, (grouped.get(groupedPrice) ?? 0) + size);
    }

    const sorted = [...grouped.entries()]
      .sort((a, b) => (order === "asc" ? a[0] - b[0] : b[0] - a[0]))
      .slice(0, this.config.visibleLevels);

    let runningTotal = 0;

    const levels = sorted.map(([price, size]) => {
      runningTotal += size;
      return {
        price,
        size,
        total: runningTotal,
        depthRatio: 0,
      };
    });

    const maxTotal = levels[levels.length - 1]?.total ?? 1;

    return levels.map((level) => ({
      ...level,
      depthRatio: maxTotal > 0 ? level.total / maxTotal : 0,
    }));
  }
}

export const orderBookStore = new OrderBookStore();