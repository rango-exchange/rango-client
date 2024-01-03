import type { Tokens } from '@yeager-dev/widget-embedded';
import type { Token } from 'rango-sdk';

export type TokenType = Token & { checked?: boolean; pinned?: boolean };
export interface PropTypes {
  list: TokenType[];
  selectedBlockchains: string[];
  onChange: (
    items?: { [blockchain: string]: Tokens },
    pinnedTokens?: TokenType[]
  ) => void;
  tokensConfig?: { [blockchain: string]: Tokens };
}

export interface TokensListProps {
  onChange: (item: TokenType, type: 'checked' | 'pinned') => void;
  onChangeAll: (selected: boolean) => void;
  showSelectedTokens: boolean;
  setShowSelectedTokens: (show: boolean) => void;
  list: TokenType[];
  isAllSelected: boolean;
  isExcluded: boolean;
}

export interface BlockchainProps {
  onClick: () => void;
  label: string;
  itemCountLabel: 'All' | number;
  isSelected: boolean;
}
