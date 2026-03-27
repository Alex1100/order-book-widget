import React from "react";
import { formatPrice, formatSize } from "../orderbook/format";
import { Container } from '@mantine/core';
import type { Flash } from "../orderbook/types";

type Side = "bid" | "ask";

type Props = {
  price: number;
  size: number;
  total: number;
  depthRatio: number;
  side: Side;
  flash?: Flash;
};

export const OrderBookRow = React.memo(function OrderBookRow({
  price,
  size,
  total,
  depthRatio,
  side,
  flash,
}: Props) {
  const flashClass = flash ? `row-flash-${flash}` : '';

  return (
    <Container className={`row row-${side} ${flashClass}`} size="lg">
      <Container
        className="row-depth"
        style={{
          width: `${Math.max(0, Math.min(100, depthRatio * 100))}%`,
        }}
      />
      <span className="row-price">{formatPrice(price)}</span>
      <span className="row-size">{formatSize(size)}</span>
      <span className="row-total">{formatSize(total)}</span>
    </Container>
  );
});
