import { useEffect, useMemo } from 'react';

import { createHyperliquidSocket } from '../socket-connections/hyperliquidSocket';

export function useOrderBookController({
  symbol,
  nSigFigs,
  grouping,
  visibleLevels,
}: {
  symbol: string;
  nSigFigs: number;
  grouping: number;
  visibleLevels: number;
}) {
  const socket = useMemo(() => createHyperliquidSocket(), []);

  useEffect(() => {
    socket.connect({ symbol, nSigFigs, grouping, visibleLevels });
    return () => socket.disconnect();
  }, [socket, symbol, nSigFigs, grouping, visibleLevels]);
}
