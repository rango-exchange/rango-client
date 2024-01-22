export type PropTypes = {
  fee: string;
  time: string | number;
  steps: number;
  onClickFee?: () => void;
  tooltipGas?: string;
  feeWarning?: boolean;
  tooltipContainer?: HTMLElement;
};
