import type { TokenType } from '../TokensPanel/TokensPanel.types';

export interface CommonListProps {
  type: 'Blockchains' | 'Bridges' | 'DEXs' | 'Wallets';
  defaultSelectedItems: string[];
  list: MapSupportedList[];
  onChange: (items?: string[]) => void;
}

interface TokensListProps {
  type: 'Tokens';
  list: TokenType[];
  selectedBlockchains: string[];
  onChange: (selectedTokens?: TokenType[], pinnedTokens?: TokenType[]) => void;
}
export type MuliSelectPropTypes = (TokensListProps | CommonListProps) & {
  value?: string[];
  label: string;
  icon: React.ReactNode;
};

export interface MultiSelectChipProps {
  label: string;
  variant?: 'contained' | 'outlined';
}

export type MapSupportedList = {
  title: string;
  logo: string;
  name: string;
  supportedNetworks?: string[];
};
