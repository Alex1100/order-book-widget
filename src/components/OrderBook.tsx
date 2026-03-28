import { Container } from '@mantine/core';

import { useMobileOrientation } from '../hooks/useMobileOrientation';
import type { BookLevel, OrderBookSnapshot } from '../types/orderBookTypes';
import { OrderBookRow } from './OrderRow';
import { SpreadRow } from './SpreadRow';

interface OrderBookProps {
  asks: BookLevel[];
  bids: BookLevel[];
  snapshot: OrderBookSnapshot;
  animate?: boolean;
}

function OrderBookSide({
  levels,
  side,
  animate,
}: {
  levels: BookLevel[];
  side: 'ask' | 'bid';
  animate: boolean;
}) {
  return (
    <div className={`side side--${side}`}>
      <div className="head">
        <span>Price</span>
        <span>Size</span>
        <span>Total</span>
      </div>

      <div className="rows">
        {levels.map((level) => (
          <OrderBookRow
            key={`${side}-${level.price}`}
            price={level.price}
            size={level.size}
            total={level.total}
            depthRatio={level.depthRatio}
            side={side}
            flash={animate ? level.flash : undefined}
          />
        ))}
      </div>
    </div>
  );
}

// TODO Future improvement can consider adding light and dark mode

export function OrderBook({ asks, bids, snapshot, animate = true }: OrderBookProps) {
  const { isMobile, orientation } = useMobileOrientation();
  const isLandscape = orientation === 'landscape' && isMobile;

  if (isLandscape) {
    return (
      <Container className="card card--landscape">
        <Container className="table table--landscape">
          <OrderBookSide levels={bids} side="bid" animate={animate} />

          <Container className="spreadColumn">
            <div className="spreadColumn__label">Spread</div>
            <SpreadRow isLandscape={isLandscape} spread={snapshot.spread} mid={snapshot.mid} />
          </Container>

          <OrderBookSide levels={asks} side="ask" animate={animate} />
        </Container>
      </Container>
    );
  }
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

        <SpreadRow isLandscape={false} spread={snapshot.spread} mid={snapshot.mid} />

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
