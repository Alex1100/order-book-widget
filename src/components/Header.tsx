import {
  Container,
  Group,
  Image,
  Select,
  type SelectProps,
  Switch,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconHelpFilled } from '@tabler/icons-react';
import { useState } from 'react';

import BtcIcon from '../assets/btc.svg';
import EthIcon from '../assets/eth.svg';
import { useMobileOrientation } from '../hooks/useMobileOrientation';
import type { OrderBookSnapshot } from '../types/orderBookTypes';
import { AssetNames, Symbols } from '../utils/constants';
import {
  OrderBookGranularityControls,
  type OrderBookGranularityControlsProps,
} from './OrderBookGranularityControls';

export interface HeaderProps extends OrderBookGranularityControlsProps {
  animateOrderBook: boolean;
  snapshot: OrderBookSnapshot;
  setAnimateOrderBook: React.Dispatch<React.SetStateAction<boolean>>;
}

const AssetIconMap: Record<string, string> = {
  [AssetNames.ETH]: EthIcon,
  [AssetNames.BTC]: BtcIcon,
};

const renderSelectOption: SelectProps['renderOption'] = ({ option }) => {
  const icon = AssetIconMap[option.value];
  return (
    <Group flex="nowrap">
      <Image src={icon} w="32" h="32" />
      <Text>{option.value}-USD</Text>
    </Group>
  );
};

const animateTooltipLabel = `
  What "up"/"down" flash means

  - flash = "up" (green)

  A price level was created or increased (size grew).
  Often interpreted as stronger buy pressure (for bids) or stronger pullback for asks.

  - flash = "down" (red)

  A price level was deleted or decreased (size shrunk).
  Often interpreted as weaker interest at that level (for bids) or stronger sell urgency (for asks).
`;

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

  const { isMobile, orientation } = useMobileOrientation();
  const [isOpen, setIsOpen] = useState(false);
  const isLandscape = orientation === 'landscape' && isMobile;

  if (isLandscape) {
    return (
      <Container className={'header-landscape'}>
        <Container className={'head-landscape-left-root'}>
          <Container className="left-section-landscape">
            <Select
              className="symbol-select"
              aria-label="Select Asset"
              value={currentSymbol}
              data={Symbols}
              onDropdownOpen={() => setIsOpen(true)}
              onDropdownClose={() => setIsOpen(false)}
              onChange={(value) => {
                setCurrentSymbol(value ?? 'BTC');
              }}
              variant="unstyled"
              leftSection={<Image src={currentAssetIcon} w="32" h="32" />}
              styles={{
                input: {
                  width: 'auto',
                  padding: '24px',
                },
                section: {
                  paddingLeft: '24px',
                  marginRight: '8px',
                },
              }}
              renderOption={renderSelectOption}
              chevronColor={'goldenrod'}
              rightSection={
                isOpen ? (
                  <IconChevronDown width={16} height={16} />
                ) : (
                  <IconChevronUp width={16} height={16} />
                )
              }
            />
            <Container className="subtitle">
              {snapshot.isConnected ? 'Live' : 'Disconnected'}
            </Container>
          </Container>
        </Container>
        <OrderBookGranularityControls
          currentSymbol={currentSymbol}
          setCurrentSymbol={setCurrentSymbol}
          setNSigFigs={setNSigFigs}
          nSigFigs={nSigFigs}
          grouping={grouping}
          setGrouping={setGrouping}
        />
      </Container>
    );
  }

  return (
    <Container className={`header`}>
      <Container className={'ml-0 px-0'}>
        <Container className="left-section">
          <Container className="inline-flex-container">
            <Switch
              label="Animate order book"
              labelPosition="left"
              checked={animateOrderBook}
              onChange={(event) => setAnimateOrderBook(event.currentTarget.checked)}
            />
            <Tooltip
              label={animateTooltipLabel}
              multiline
              withArrow
              w={220}
              transitionProps={{ duration: 200 }}
            >
              <ThemeIcon bg={'transparent'} color="white">
                <IconHelpFilled width={'70'} height={'70%'} />
              </ThemeIcon>
            </Tooltip>
          </Container>
          <Container className="fd-row jc-space-between m-0 select-asset">
            <Select
              className="symbol-select"
              aria-label="Select Asset"
              value={currentSymbol}
              data={Symbols}
              onDropdownOpen={() => setIsOpen(true)}
              onDropdownClose={() => setIsOpen(false)}
              onChange={(value) => {
                setCurrentSymbol(value ?? 'BTC');
              }}
              variant="unstyled"
              leftSection={<Image src={currentAssetIcon} w="32" h="32" />}
              styles={{
                input: {
                  width: 'auto',
                  padding: '24px',
                },
                section: {
                  paddingLeft: '24px',
                  marginRight: '8px',
                },
              }}
              renderOption={renderSelectOption}
              chevronColor={'goldenrod'}
              rightSection={
                isOpen ? (
                  <IconChevronDown width={16} height={16} />
                ) : (
                  <IconChevronUp width={16} height={16} />
                )
              }
            />
          </Container>
          <Container className="subtitle">
            {snapshot.isConnected ? 'Live' : 'Disconnected'}
          </Container>
        </Container>
      </Container>

      <OrderBookGranularityControls
        currentSymbol={currentSymbol}
        setCurrentSymbol={setCurrentSymbol}
        setNSigFigs={setNSigFigs}
        nSigFigs={nSigFigs}
        grouping={grouping}
        setGrouping={setGrouping}
      />
    </Container>
  );
};
