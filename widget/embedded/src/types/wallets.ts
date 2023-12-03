import type { WalletType } from '@rango-dev/wallets-shared';

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

type Blockchain = string;
type TokenSymbol = string;
type Address = string;

/** `blockchain-symbol-Address` */
export type TokenHash = `${Blockchain}-${TokenSymbol}-${Address}`;

export type TokensBalance = {
  [key: TokenHash]: Balance;
};
