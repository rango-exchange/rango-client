export type TokenSectionProps = {
  chainImage?: string;
  tokenImage?: string;
  tokenSymbol: string;
  id: string;
  chain: string;
  chianImageId?: string;
  error?: boolean;
  onClick: () => void;
  loading?: boolean;
  warning?: boolean;
  tooltipContainer?: HTMLElement;
  selectionType?: 'token' | 'chain';
};
