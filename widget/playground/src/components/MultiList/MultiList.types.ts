interface WalletProps {
  type: 'Wallets';
}

interface BlockchainProps {
  type: 'Blockchains';
}

interface CommonProps {
  label: string;
  icon: React.ReactNode;
  onChange: (items?: string[]) => void;
  defaultSelectedItems: string[];
  list: MapSupportedList[];
}

export type MultiListPropTypes = CommonProps & (BlockchainProps | WalletProps);

export type MapSupportedList = {
  title: string;
  logo: string;
  name: string;
  networks: string[];
};
