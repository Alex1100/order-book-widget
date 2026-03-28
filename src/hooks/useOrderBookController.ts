import { useEffect, useMemo } from "react";
import { createHyperliquidSocket } from "../socket-connections/hyperliquidSocket";

export function useOrderBookController(symbol: string, nSigFigs: number, grouping: number) {
  const socket = useMemo(() => createHyperliquidSocket(), []);

  useEffect(() => {
    socket.connect(symbol, nSigFigs, grouping);
    return () => socket.disconnect();
  }, [socket, symbol, nSigFigs, grouping]);
}