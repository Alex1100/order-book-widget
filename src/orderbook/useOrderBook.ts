import { useSyncExternalStore } from "react";
import { orderBookStore } from "./orderBookStore";

export function useOrderBook() {
  return useSyncExternalStore(
    orderBookStore.subscribe,
    orderBookStore.getSnapshot,
  );
}