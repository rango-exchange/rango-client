import type { Asset, Token } from 'rango-sdk';

export interface CommonListProps {
  type: 'Blockchains' | 'Bridges' | 'DEXs' | 'Wallets';
  defaultSelectedItems: string[];
  list: MapSupportedList[];
  onChange: (items?: string[]) => void;
}

interface TokensListProps {
  type: 'Tokens';
  list: (Token & { checked: boolean })[];
  selectedBlockchains: string[];
  onChange: (items?: Asset[]) => void;
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
