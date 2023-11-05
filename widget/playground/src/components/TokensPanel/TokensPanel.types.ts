import type { Asset, Token } from 'rango-sdk';

export type TokenType = Token & { checked: boolean };
export interface PropTypes {
  list: TokenType[];
  selectedBlockchains: string[];
  onChange: (items?: Asset[]) => void;
}

export interface TokensListProps {
  onChange: (item: TokenType) => void;
  onChangeAll: (selected: boolean) => void;
  showSelectedTokens: boolean;
  setShowSelectedTokens: (show: boolean) => void;
  list: TokenType[];
  isAllSelected: boolean;
}

export interface BlockchainProps {
  onClick: () => void;
  label: string;
  itemCountLabel: 'All' | number;
  isSelected: boolean;
}
