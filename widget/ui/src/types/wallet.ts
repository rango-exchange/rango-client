import type {
  DerivationPathProperty,
  NamespacesProperty,
  WalletType,
} from '@hub3js/core';

export type NamespaceMeta = NamespacesProperty['value']['data'][number];
export type NeedsNamespace = NamespacesProperty['value'];
export type NeedsDerivationPath = DerivationPathProperty['value'];

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
