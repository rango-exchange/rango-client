export interface MultiListPropTypes {
  type: 'Bridges' | 'DEXs' | 'Blockchains' | 'Wallets';
  label: string;
  icon: React.ReactNode;
  onChange: (items?: string[]) => void;
  defaultSelectedItems: string[];
  showCategory?: boolean;
  list: MapSupportedList[];
}

export type MapSupportedList = {
  title: string;
  logo: string;
  name: string;
  networks?: string[];
};
