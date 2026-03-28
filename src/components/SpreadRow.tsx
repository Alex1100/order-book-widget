import { Container } from '@mantine/core';
import React from 'react';

import { formatPrice } from '../utils/format';

type SpreadRowProps = {
  spread: number | null;
  mid: number | null;
  isLandscape?: boolean;
};

export const SpreadRow = React.memo(function SpreadRow({
  spread,
  mid,
  isLandscape,
}: SpreadRowProps) {
  return (
    <Container className={isLandscape ? 'spread-landscape' : 'spread'}>
      <span>Spread</span>
      <span>{formatPrice(spread)}</span>
      <span>Mid {formatPrice(mid)}</span>
    </Container>
  );
});
