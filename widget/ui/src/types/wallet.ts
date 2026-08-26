import type { Namespace } from '@hub3js/namespaces';

/** The id a provider registers itself under, e.g. `metamask`. */
export type WalletType = string;

export type NamespaceMeta = {
  label: string;
  /**
   * By using a matched `blockchain.name` (in meta) and `id`, we show logo in Namespace modal
   * e.g. ETH
   */
  id: string;
  value: Namespace;
  unsupported?: boolean;
  isChainSupported: (chainId: string) => boolean;
};

export type NeedsNamespace = {
  selection: 'single' | 'multiple';
  data: NamespaceMeta[];
};

export type NeedsDerivationPath = {
  data: {
    id: string;
    label: string;
    namespace: Namespace;
    generateDerivationPath: (index: string) => string;
  }[];
};

export type InstallObjects = {
  CHROME?: string;
  FIREFOX?: string;
  EDGE?: string;
  BRAVE?: string;
  DEFAULT: string;
};

interface Wallet {
  chain: string;
  address: string;
  walletType: WalletType;
}

export type TokenBalance = {
  chain: string;
  symbol: string;
  ticker: string;
  address: string | null;
  rawAmount: string;
  decimal: number | null;
  amount: string;
  logo: string | null;
  usdPrice: number | null;
};

export interface ConnectedWallet extends Wallet {
  balances: TokenBalance[] | null;
  loading: boolean;
  error: boolean;
  explorerUrl: string | null;
}
