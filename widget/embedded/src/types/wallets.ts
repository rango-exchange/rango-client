import type { WalletInfo } from '@rango-dev/ui';
import type { Namespace, WalletType } from '@rango-dev/wallets-shared';

export interface Wallet {
  chain: string;
  address: string;
  walletType: WalletType;
}

export type Balance = {
  amount: string;
  decimals: number;
  usdValue: string;
};

export type Blockchain = string;
type TokenSymbol = string;
type Address = string;

/** `blockchain-symbol-Address` */
export type TokenHash = `${Blockchain}-${TokenSymbol}-${Address}`;

export type TokensBalance = {
  [key: TokenHash]: Balance;
};

export type WalletInfoWithExtra = WalletInfo & {
  namespaces?: Namespace[];
  singleNamespace?: boolean;
  needsDerivationPath?: boolean;
};
