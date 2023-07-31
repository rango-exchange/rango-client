import { WalletProvider } from '@rango-dev/wallets-core';
import { WalletType } from '@rango-dev/wallets-shared';
export type Wallet = {
  title: string;
  logo: string;
  type: WalletType;
};

export type Wallets = Array<Wallet>;

export type Type = 'Destination' | 'Source';

export interface Source {
  title: string;
  type: 'BRIDGE' | 'AGGREGATOR' | 'DEX';
}
