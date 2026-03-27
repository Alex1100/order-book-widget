import React from "react";
import { formatPrice } from "../orderbook/format";
import { Container } from '@mantine/core';

type Props = {
  spread: number | null;
  mid: number | null;
};

export const SpreadRow = React.memo(function SpreadRow({
  spread,
  mid,
}: Props) {
  return (
    <Container className="spread">
      <span>Spread</span>
      <span>{formatPrice(spread)}</span>
      <span>Mid {formatPrice(mid)}</span>
    </Container>
  );
});
