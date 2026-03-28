import { Container, Select, ThemeIcon, Tooltip } from "@mantine/core"
import { IconChevronDown, IconChevronUp, IconHelpFilled } from "@tabler/icons-react"

interface GranularityControlProps {
  label: string;
  tooltipLabel: string;
  selectClassName: string;
  granularityValue: number;
  options: string[];
  isOpen: boolean;
  rootContainerClassNames: string,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (value: number) => void;
  iconProps?: {
    width: string;
    height: string;
  };
};

export const GranularityControl = ({
  label,
  tooltipLabel,
  selectClassName,
  granularityValue,
  options,
  handleChange,
  isOpen,
  setIsOpen,
  rootContainerClassNames = "",
  iconProps = {width: '70%', height: '70%'},
}: GranularityControlProps) => {
  const { width, height } = iconProps;
  return (
    <Container className={rootContainerClassNames}>
      <Container className="flex align-itm-ctr goldenrod-color">
        <span>{label}</span>
        <Tooltip label={tooltipLabel} multiline withArrow w={220} transitionProps={{ duration: 200 }}>
          <ThemeIcon bg={'transparent'}>
            <IconHelpFilled width={width} height={height} />
          </ThemeIcon>
        </Tooltip>
      </Container>
      <Select
        className={selectClassName}
        value={granularityValue.toString()}
        data={options}
        onChange={(value) => {
          handleChange(Number(value));
        }}
        onDropdownOpen={() => setIsOpen(true)}
        onDropdownClose={() => setIsOpen(false)}
        comboboxProps={{
          withinPortal: false,
        }}
        variant="unstyled"
        styles={{
          dropdown: { width: '100%'},
          input: {
            width: "100%",
          },
        }}
        chevronColor={"goldenrod"}
        rightSection={isOpen ?
          <IconChevronDown style={{backgroundColor: '#595959 !important'}} width={16} height={16} /> :
          <IconChevronUp width={16} height={16} />
        }
      />
    </Container>
  );
}