import { Container } from '@mantine/core';
import React, { useEffect, useReducer } from "react";

import { initialState, orderBookRowReducer, SET_ACTIVE_FLASH } from "../reducers/orderBookRowReducer";
import type { Flash, OrderSide } from "../types/orderBookTypes";
import { formatPrice, formatSize } from "../utils/format";


type OrderBookRowProps = {
  price: number;
  size: number;
  total: number;
  depthRatio: number;
  side: OrderSide;
  flash?: Flash;
};

export const OrderBookRow = React.memo(function OrderBookRow({
  price,
  size,
  total,
  depthRatio,
  side,
  flash,
}: OrderBookRowProps) {
  const [orderBookState, dispatch] = useReducer(orderBookRowReducer, initialState);
  
  useEffect(() => {
    if (!flash) return;
    dispatch({ type: SET_ACTIVE_FLASH, activeFlash: flash })
    const id = setTimeout(() => {
      dispatch({ type: SET_ACTIVE_FLASH, activeFlash: undefined });
    }, 400);
    return () => clearTimeout(id);
  }, [flash]);

  const { activeFlash } = orderBookState;
  const flashClass = activeFlash ? `row-flash-${activeFlash}` : '';

  return (
    <Container className={`row row-${side} ${flashClass}`} size="lg">
      <Container
        className="row-depth"
        style={{
          width: `${Math.max(0, Math.min(100, depthRatio * 100))}%`,
        }}
      />
      <span className="row-price">{formatPrice(price)}</span>
      <span className="row-size">{formatSize(size)}</span>
      <span className="row-total">{formatSize(total)}</span>
    </Container>
  );
});

