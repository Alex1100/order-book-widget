import React from "react";
import { formatPrice } from "../utils/format";
import { Container } from '@mantine/core';

type SpreadRowProps = {
  spread: number | null;
  mid: number | null;
};

export const SpreadRow = React.memo(function SpreadRow({
  spread,
  mid,
}: SpreadRowProps) {
  return (
    <Container className="spread">
      <span>Spread</span>
      <span>{formatPrice(spread)}</span>
      <span>Mid {formatPrice(mid)}</span>
    </Container>
  );
});
