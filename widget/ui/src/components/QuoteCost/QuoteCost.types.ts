export type PropTypes = {
  fee: string;
  time: string | number;
  steps?: number;
  onClickFee?: React.MouseEventHandler<HTMLDivElement>;
  tooltipGas?: string;
  feeWarning?: boolean;
  timeWarning?: boolean;
  tooltipContainer?: HTMLElement;
};
