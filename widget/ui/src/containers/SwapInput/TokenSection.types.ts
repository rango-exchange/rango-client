export type TokenSectionProps = {
  chainImage: string;
  tokenImage: string;
  tokenSymbol: string;
  chain: string;
  chianImageId?: string;
  error?: boolean;
  onClick: () => void;
  loading?: boolean;
};
