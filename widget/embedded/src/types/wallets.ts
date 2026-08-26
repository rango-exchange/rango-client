import type { WalletType } from '@rango-dev/provider-all';
import type { WalletInfo } from '@rango-dev/ui';

export type { WalletType };

export interface Wallet {
  chain: string;
  address: string;
  walletType: WalletType;
  isContractWallet?: boolean;
  derivationPath?: string;
}

export type Balance = {
  amount: string;
  decimals: number;
  usdValue: string | null;
};

export type Blockchain = string;
type TokenSymbol = string;
type Address = string;

/** `blockchain-symbol-Address` */
export type TokenHash = `${Blockchain}-${TokenSymbol}-${Address}`;

export type TokensBalance = {
  [key: TokenHash]: Balance;
};

export type WalletInfoWithExtra = WalletInfo;
