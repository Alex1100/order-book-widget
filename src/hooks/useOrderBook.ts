import { useSyncExternalStore } from 'react';

import { orderBookStore } from '../stores/orderBookStore';

export function useOrderBook() {
  return useSyncExternalStore(orderBookStore.subscribe, orderBookStore.getSnapshot);
}
