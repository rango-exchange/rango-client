import type { Token } from 'rango-sdk';

export type TokenType = Token & { checked: boolean; pinned: boolean };
export interface PropTypes {
  list: TokenType[];
  selectedBlockchains: string[];
  onChange: (selectedTokens?: TokenType[], pinnedTokens?: TokenType[]) => void;
}

export interface TokensListProps {
  onChange: (item: TokenType, type: 'checked' | 'pinned') => void;
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
