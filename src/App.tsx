import './App.css';

import { Container, useComputedColorScheme } from '@mantine/core';
import { useMemo, useState } from 'react';

import { Header } from './components/Header';
import { OrderBook } from './components/OrderBook';
import { useMobileOrientation } from './hooks/useMobileOrientation';
import { useOrderBook } from './hooks/useOrderBook';
import { useOrderBookController } from './hooks/useOrderBookController';

function App() {
  const { isMobile, orientation } = useMobileOrientation();
  const [currentSymbol, setCurrentSymbol] = useState('BTC');
  const [nSigFigs, setNSigFigs] = useState(5);
  const [grouping, setGrouping] = useState(1);
  const [visibleLevels, setVisibleLevels] = useState(12);
  const [animateOrderBook, setAnimateOrderBook] = useState(true);
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

  useOrderBookController({ symbol: currentSymbol, nSigFigs, grouping, visibleLevels });

  const snapshot = useOrderBook();

  /**
   * Asks (sells) → red — representing selling pressure / supply
   * Bids (buys) → green — representing buying pressure / demand
   */
  const asks = useMemo(() => {
    if (orientation === 'landscape' && isMobile) {
      return [...snapshot.asks];
    }
    return [...snapshot.asks].reverse();
  }, [orientation, isMobile, snapshot.asks]);
  const bids = snapshot.bids;

  return (
    <>
      <Container
        className={`card${computedColorScheme === 'dark' ? ' dark-mode-card-bg' : ' light-mode-card-bg'}`}
        size="lg"
      >
        <Header
          animateOrderBook={animateOrderBook}
          setAnimateOrderBook={setAnimateOrderBook}
          grouping={grouping}
          setGrouping={setGrouping}
          nSigFigs={nSigFigs}
          setNSigFigs={setNSigFigs}
          visibleLevels={visibleLevels}
          setVisibleLevels={setVisibleLevels}
          currentSymbol={currentSymbol}
          snapshot={snapshot}
          setCurrentSymbol={setCurrentSymbol}
        />
        <OrderBook asks={asks} bids={bids} snapshot={snapshot} animate={animateOrderBook} />
      </Container>
    </>
  );
}

export default App;
