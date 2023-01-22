export type Asset = {
  blockchain: string;
  symbol: string;
  address: string | null;
};
type EvmInfo = {
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  addressUrl: string;
  transactionUrl: string;
};

export interface CosmosChainInfo {
  rpc: string;
  rest: string;
  chainId: string;
  cosmostationLcdUrl?: string;
  cosmostationApiUrl?: string;
  cosmostationDenomTracePath?: string;
  mintScanName?: string | null;
  chainName: string;
  stakeCurrency: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId: string;
    coinImageUrl: string;
  };
  bip44: {
    coinType: number;
  };
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  currencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId: string;
    coinImageUrl: string;
  }[];
  feeCurrencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId: string;
    coinImageUrl: string;
  }[];
  features: string[];
  explorerUrlToTx: string;
  gasPriceStep?: {
    low: number;
    average: number;
    high: number;
  };
}

export interface CosmosInfo extends Omit<CosmosChainInfo, 'chianId'> {
  experimental: boolean;
}

export type BlockchainInfo = EvmInfo | CosmosInfo | null;

export enum GenericTransactionType {
  EVM = 'EVM',
  TRANSFER = 'TRANSFER',
  COSMOS = 'COSMOS',
  SOLANA = 'SOLANA',
}

export interface BlockchainMeta {
  name: string;
  logo: string;
  displayName: string;
}

export type SwapperMeta = {
  id: string;
  title: string;
  logo: string;
  swapperGroup: string;
};

export type TokenMeta = {
  blockchain: string;
  symbol: string;
  image: string;
  address: string | null;
  usdPrice: number | null;
  isSecondaryCoin: boolean;
  coinSource: string | null;
  coinSourceUrl: string | null;
  name: string | null;
  decimals: number;
  balance?: { amount: string; usdPrice: string };
};

export interface LiquiditySource {
  title: string;
  logo: string;
  type: 'exchange' | 'bridge';
  selected: boolean;
}
