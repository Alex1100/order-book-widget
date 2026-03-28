# Order Book Widget App Architecture

https://github.com/user-attachments/assets/6aefaa2c-78c4-42c7-8147-99f0fdb1e5f4



## Overview

A real-time cryptocurrency order book widget built with React and Mantine. It connects to the Hyperliquid WebSocket API and renders a live, updating order book with configurable grouping, significant figures, and portrait/landscape layouts.

---

## Directory Structure

```
src/
├── components/          # UI components
│   ├── Header.tsx               # Symbol selector, grouping/sig-fig controls, connection status
│   ├── OrderBook.tsx            # Layout switcher (portrait vs landscape), renders sides
│   ├── OrderRow.tsx             # Single price level row with depth bar and flash animation
│   ├── SpreadRow.tsx            # Spread / mid price display between bid and ask sides
│   ├── OrderBookGranularityControls.tsx  # Grouping step controls
│   └── GranularityControl.tsx   # Individual granularity control input
├── hooks/
│   ├── useOrderBook.ts          # Subscribes React to the external store via useSyncExternalStore
│   ├── useOrderBookController.ts # Manages WebSocket lifecycle (connect/disconnect on config change)
│   └── useMobileOrientation.ts  # Detects portrait vs landscape orientation
├── stores/
│   └── orderBookStore.ts        # External store: holds order book state, processes updates
├── socket-connections/
│   └── hyperliquidSocket.ts     # WebSocket connection to Hyperliquid, feeds data into the store
├── reducers/
│   └── orderBookRowReducer.ts   # Local reducer for per-row flash animation state
├── types/
│   └── orderBookTypes.ts        # Shared TypeScript types
└── utils/
    ├── format.ts                # Price and size formatters
    └── constants.ts             # Shared constants
```

---

## Data Flow

```
Hyperliquid WebSocket
        │
        ▼
hyperliquidSocket.ts        — parses raw WS messages, calls store methods
        │
        ▼
OrderBookStore              — applies deltas/snapshots, groups levels, computes spread/mid/depth
        │   (queueMicrotask batching)
        ▼
useSyncExternalStore        — notifies React when snapshot reference changes
        │
        ▼
useOrderBook()              — returns current snapshot to App.tsx
        │
        ▼
OrderBook / OrderRow        — renders bid and ask levels with depth bars and flash animations
```

---

## State Management: `useSyncExternalStore`

`useSyncExternalStore` connects React's render cycle to `OrderBookStore`, which lives entirely outside React.

**The store** (`src/stores/orderBookStore.ts`) is a plain class instance that:

- Holds the raw bid/ask `Map`s and the current `snapshot` object
- Maintains a `Set` of listener callbacks
- Exposes `subscribe` (add/remove a listener) and `getSnapshot` (return the current snapshot)

**The hook** (`src/hooks/useOrderBook.ts`) calls:

```ts
useSyncExternalStore(orderBookStore.subscribe, orderBookStore.getSnapshot);
```

React uses this to:

1. **Register** the component as a listener via `subscribe` — so whenever the store calls `listener()` inside `publish()`, React knows to re-check
2. **Read** the current value via `getSnapshot` — React compares the returned reference to the previous one; if it changed, it re-renders

**The update cycle:**

1. A WebSocket message arrives → `applyDeltaLevels()` or `replaceBook()` is called
2. Those call `schedulePublish()`, which batches via `queueMicrotask`
3. `publish()` builds a new `snapshot` object (new reference) and notifies all listeners
4. React sees the snapshot reference changed → re-renders any component using `useOrderBook()`

The key benefit over `useState`/`useEffect` is that `useSyncExternalStore` is safe for concurrent React — it guarantees the snapshot is consistent across a render and prevents tearing.

---

## WebSocket Layer

`createHyperliquidSocket()` returns a `{ connect, disconnect }` controller. `connect` is called with the current symbol, sig-figs, and grouping config. On each new connection:

1. Any existing socket is closed and the book is reset
2. A new `WebSocket` is opened to `wss://api.hyperliquid.xyz/ws`
3. On `open`, a `subscribe` message is sent for the `l2Book` channel
4. The first message received is treated as a full snapshot (`replaceBook`); subsequent messages are incremental deltas (`applyDeltaLevels`)

`useOrderBookController` manages this lifecycle inside React — it creates the socket once (via `useMemo`) and calls `connect`/`disconnect` in a `useEffect` that reruns whenever symbol, sig-figs, or grouping changes.

---

## Layout

`OrderBook.tsx` reads the device orientation via `useMobileOrientation` and renders one of two layouts:

- **Portrait** — asks stacked above spread above bids, single column
- **Landscape** — three-column grid: asks | spread | bids, with depth bars mirrored (asks grow right-to-left, bids grow left-to-right)

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
