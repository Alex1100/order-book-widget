import { Container } from '@mantine/core';

import { OrderBookRow } from "./OrderRow";
import { SpreadRow } from "./SpreadRow";
import type { BookLevel, OrderBookSnapshot } from "../types/orderBookTypes";

interface OrderBookProps {
  asks: BookLevel[];
  bids: BookLevel[];
  snapshot: OrderBookSnapshot;
  animate?: boolean;
};

export function OrderBook({asks, bids, snapshot, animate = true}: OrderBookProps) {
  return (
    <Container className="card">
      <Container className="table">
        <Container className="head">
          <span>Price</span>
          <span>Size</span>
          <span>Total</span>
        </Container>

        <Container className="side">
          {asks.map((level) => (
            <OrderBookRow
              key={`ask-${level.price}`}
              price={level.price}
              size={level.size}
              total={level.total}
              depthRatio={level.depthRatio}
              side="ask"
              flash={animate ? level.flash : undefined}
            />
          ))}
        </Container>

        <SpreadRow spread={snapshot.spread} mid={snapshot.mid} />

        <Container className="side">
          {bids.map((level) => (
            <OrderBookRow
              key={`bid-${level.price}`}
              price={level.price}
              size={level.size}
              total={level.total}
              depthRatio={level.depthRatio}
              side="bid"
              flash={animate ? level.flash : null}
            />
          ))}
        </Container>
      </Container>
    </Container>
  );
}
