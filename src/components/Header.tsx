
import type { OrderBookSnapshot } from "../orderbook/types";
import BtcIcon from "../assets/btc.svg";
import EthIcon from "../assets/eth.svg";

import { Container, Select, Switch, ThemeIcon, Tooltip, Image } from '@mantine/core';
import { IconHelpFilled } from '@tabler/icons-react';

const symbols = ["BTC", "ETH"];
const nSigFigOptions = ["2", "3", "4", "5"];
const groupingOptions = ["0.01", "0.1", "0.5", "1", "2", "5", "10", "50", "100", "1000"];

const AssetNames = {
  // EVM
  ETH: "ETH",
  // UTXO
  BTC: "BTC",
} as const

const AssetIconMap: Record<string, string> = {
  [AssetNames.ETH]: EthIcon,
  [AssetNames.BTC]: BtcIcon,
};

interface HeaderProps {
    animateOrderBook: boolean;
    setAnimateOrderBook: React.Dispatch<React.SetStateAction<boolean>>;
    snapshot: OrderBookSnapshot;
    currentSymbol: string;
    setCurrentSymbol: React.Dispatch<React.SetStateAction<string>>;
    setNSigFigs: React.Dispatch<React.SetStateAction<number>>;
    nSigFigs: number;
    grouping: number;
    setGrouping: React.Dispatch<React.SetStateAction<number>>;
}


export const Header = ({
    animateOrderBook,
    setAnimateOrderBook,
    snapshot,
    currentSymbol,
    setCurrentSymbol,
    setNSigFigs,
    nSigFigs,
    grouping,
    setGrouping,
}: HeaderProps) => {
      const currentAssetIcon = AssetIconMap[currentSymbol];

    return (
        <Container className="header">
          <Container>
            <Container className="title inline-flex-container">
              <Image src={currentAssetIcon} w="32" h="32" />
              {snapshot.symbol}-USD
            </Container>
            <Container className="subtitle">
              {snapshot.isConnected ? "Live" : "Disconnected"}
            </Container>
            <Container className="inline-flex-container">
            <Switch
                label="Animate order book"
                checked={animateOrderBook}
                onChange={(event) => setAnimateOrderBook(event.currentTarget.checked)}
              />
              <Tooltip label={`
              What "up"/"down" flash means
              
              - flash = "up" (green)

                A price level was created or increased (size grew).
                Often interpreted as stronger buy pressure (for bids) or stronger pullback for asks.

                - flash = "down" (red)

                A price level was deleted or decreased (size shrunk).
                Often interpreted as weaker interest at that level (for bids) or stronger sell urgency (for asks).
              `} multiline withArrow w={220} transitionProps={{ duration: 200 }}>
              <ThemeIcon bg={'transparent'}>
                <IconHelpFilled style={{ width: '70%', height: '70%' }} />
              </ThemeIcon>
            </Tooltip>
            </Container>
          </Container>
        
          <Container className="controls">
            <Container style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between'}} className="mr-0">

            <Select
              className="symbol-select"
              label="Select Asset"
              value={currentSymbol}
              data={symbols}
              onChange={(value) => setCurrentSymbol(value ?? "BTC")}
            />
            </Container>
        
            <Container style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between', gap: 'inherit'}}>
            <Container style={{display: "flex", flexDirection: 'column', gap: '0.5rem'}}>
              <Container style={{display: "flex", alignItems: 'center', gap: '0.5rem'}}>
                <span>nSigFigs</span>
                <Tooltip label="Number of significant figures - controls the precision of price display in the order book. Higher values show more decimal places." multiline withArrow w={220} transitionProps={{ duration: 200 }}>
                  <ThemeIcon bg={'transparent'}>
                    <IconHelpFilled style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                </Tooltip>
              </Container>
              <Select
                className="nSigFigs-select"
                value={nSigFigs.toString()}
                data={nSigFigOptions}
                onChange={(value) => setNSigFigs(Number(value))}
              />
            </Container>

            <Container style={{display: "flex", flexDirection: 'column', gap: '0.5rem'}}>
              <Container style={{display: "flex", alignItems: 'center', gap: '0.5rem'}}>
                <span>Grouping</span>
                <Tooltip label="Price grouping interval - controls how orders are aggregated by price level. Smaller values show more granular price levels, larger values group orders into wider price buckets for cleaner display." multiline withArrow w={220} transitionProps={{ duration: 200 }}>
                  <ThemeIcon bg={'transparent'}>
                    <IconHelpFilled style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                </Tooltip>
              </Container>
              <Select
                className="grouping-select"
                value={grouping.toString()}
                data={groupingOptions}
                onChange={(value) => setGrouping(Number(value))}
              />
            </Container>
            </Container>              
          </Container>
        </Container>
    )
}