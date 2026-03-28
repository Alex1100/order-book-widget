import { Container } from '@mantine/core';
import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { OrderBook } from './components/OrderBook'
import { useOrderBook } from './hooks/useOrderBook';
import { useOrderBookController } from './hooks/useOrderBookController';
import './App.css';

function App() {
  const [currentSymbol, setCurrentSymbol] = useState("BTC");
  const [nSigFigs, setNSigFigs] = useState(5);
  const [grouping, setGrouping] = useState(0.5);
  const [animateOrderBook, setAnimateOrderBook] = useState(true);

  useOrderBookController(currentSymbol, nSigFigs, grouping);

  const snapshot = useOrderBook();

  const asks = useMemo(() => [...snapshot.asks].reverse(), [snapshot.asks]);
  const bids = snapshot.bids;

  return (
    <>
      <Container className="card" size="lg">
        <Header 
          animateOrderBook={animateOrderBook}
          setAnimateOrderBook={setAnimateOrderBook}
          grouping={grouping}
          setGrouping={setGrouping}
          nSigFigs={nSigFigs}
          setNSigFigs={setNSigFigs}
          currentSymbol={currentSymbol}
          snapshot={snapshot}
          setCurrentSymbol={setCurrentSymbol}
        />
        <OrderBook asks={asks} bids={bids} snapshot={snapshot} animate={animateOrderBook} />
      </Container>
    </>
  )
}

export default App
