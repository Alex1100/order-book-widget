import { useMemo, useState } from 'react';
import './App.css';
import { OrderBook } from './components/OrderBook'
import { Container } from '@mantine/core';
import { useOrderBook } from './orderbook/useOrderBook';
import { useOrderBookController } from './orderbook/useOrderBookController';
import { Header } from './components/Header';

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
        <Header {...{
          animateOrderBook,
          setAnimateOrderBook,
          grouping,
          setGrouping,
          nSigFigs,
          setNSigFigs,
          currentSymbol,
          snapshot,
          setCurrentSymbol,
        }}/>
        <OrderBook asks={asks} bids={bids} snapshot={snapshot} animate={animateOrderBook} />
      </Container>
    </>
  )
}

export default App
