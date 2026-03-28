import { orderBookStore } from '../stores/orderBookStore';
import type { HyperliquidBookMessage } from '../types/orderBookTypes';

type SocketController = {
  connect: (symbol: string, nSigFigs: number, grouping: number) => void;
  disconnect: () => void;
};

const WS_URL = 'wss://api.hyperliquid.xyz/ws';

export function createHyperliquidSocket(): SocketController {
  let ws: WebSocket | null = null;
  let currentSymbol = 'BTC';
  let currentNSigFigs = 5;
  let currentGrouping = 1;
  let isInitialSnapshot = true;

  const connect = (symbol: string, nSigFigs: number, grouping: number) => {
    currentSymbol = symbol;
    currentNSigFigs = nSigFigs;
    currentGrouping = grouping;
    isInitialSnapshot = true;

    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      ws.close();
      ws = null;
    }

    orderBookStore.resetBook();
    orderBookStore.setConfig({ symbol, nSigFigs, grouping });
    orderBookStore.setConnectionStatus(false);

    ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      orderBookStore.setConnectionStatus(true);

      ws?.send(
        JSON.stringify({
          method: 'subscribe',
          subscription: {
            type: 'l2Book',
            coin: currentSymbol,
            nSigFigs: currentNSigFigs,
            grouping: currentGrouping,
          },
        }),
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as HyperliquidBookMessage | Record<string, unknown>;

        if (
          typeof msg === 'object' &&
          msg !== null &&
          'channel' in msg &&
          msg.channel === 'l2Book' &&
          'data' in msg
        ) {
          const bookMsg = msg as HyperliquidBookMessage;
          if (bookMsg.data.coin !== currentSymbol) return;

          if (isInitialSnapshot) {
            // First message after subscription is always a full snapshot
            orderBookStore.replaceBook(bookMsg.data.levels);
            isInitialSnapshot = false;
          } else {
            // Subsequent messages are delta updates
            orderBookStore.applyDeltaLevels(bookMsg.data.levels);
          }
        }
      } catch (error) {
        console.error('Failed to parse websocket message', error);
      }
    };

    ws.onerror = () => {
      orderBookStore.setConnectionStatus(false);
    };

    ws.onclose = () => {
      orderBookStore.setConnectionStatus(false);
    };
  };

  const disconnect = () => {
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      ws.close();
      ws = null;
    }
    orderBookStore.setConnectionStatus(false);
  };

  return { connect, disconnect };
}
