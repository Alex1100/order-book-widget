import { ActionIcon, Container, Popover } from "@mantine/core"
import { NSigFigOptions, GroupingOptions } from "../utils/constants"
import { GranularityControl } from "./GranularityControl";
import { IconMenu2 } from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from '@mantine/hooks';

export interface OrderBookGranularityControlsProps {
  currentSymbol: string;
  nSigFigs: number;
  grouping: number;
  setCurrentSymbol: React.Dispatch<React.SetStateAction<string>>;
  setNSigFigs: React.Dispatch<React.SetStateAction<number>>;
  setGrouping: React.Dispatch<React.SetStateAction<number>>;
};

export const OrderBookGranularityControls = ({
  nSigFigs,
  setNSigFigs,
  grouping,
  setGrouping,
}: OrderBookGranularityControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpened, { close, toggle }] = useDisclosure(false);

  return (
    <Container className="controls">    
      <Container className="fd-row jc-space-between align-itm-fs">
        <Popover
          width={300}
          position="left"
          withArrow
          shadow="xl"
          opened={isOpened}
          onChange={(opened) => {
            setIsOpen(false);
            toggle();
          }}
          closeOnEscape={true}
          closeOnClickOutside={true}
          styles={{
            dropdown: {
              backgroundColor: 'transparent'
            }
          }}
        >
      <Popover.Target>
        <ActionIcon variant="filled" aria-label="Settings" bg={'transparent'} onClick={toggle}>
          <IconMenu2 width="32" height="32" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown bg="#111214" variant="unstyled" styles={{ dropdown: { border: 'solid 2px grey' } }}>
        <GranularityControl
          label={"nSigFigs"}
          selectClassName={"nSigFigs-select goldenrod-color"}
          rootContainerClassNames="flex fd-col"
          tooltipLabel={"Number of significant figures - controls the precision of price display in the order book. Higher values show more decimal places."}
          iconProps={{width: '70%', height: '70%'}}
          granularityValue={nSigFigs}
          options={NSigFigOptions}
          handleChange={(value: number) => {
            setNSigFigs(value);
            setIsOpen(false);
            close();
          }}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
       />
       <GranularityControl 
          label={"Grouping"}
          selectClassName={"groupings-select goldenrod-color"}
          rootContainerClassNames="flex fd-col"
          tooltipLabel={"Price grouping interval - controls how orders are aggregated by price level. Smaller values show more granular price levels, larger values group orders into wider price buckets for cleaner display."}
          iconProps={{width: '70%', height: '70%'}}
          granularityValue={grouping}
          options={GroupingOptions}
          handleChange={(value: number) => {
            setGrouping(value);
            setIsOpen(false);
            close();
          }}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
       />
      </Popover.Dropdown>
    </Popover>
        
        

        
      </Container>
    </Container>
  )
}