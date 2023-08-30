export type TokenSectionProps = {
  chainImage: string;
  tokenImage: string;
  tokenSymbol: string;
  chain: string;
  error?: boolean;
  onClick: () => void;
  loading?: boolean;
};
