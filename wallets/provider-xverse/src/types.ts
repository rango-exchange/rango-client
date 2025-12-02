import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/utxo';

type XVerseAddress = {
  address: string;
  publicKey: string;
  purpose: 'ordinals' | 'payment';
  addressType: 'p2tr' | 'p2wpkh' | 'p2sh';
  walletType: 'software' | 'hardware';
};
export type XVerseResponse = {
  error?: {
    message: string;
    code: string;
  };
  result: {
    addresses: XVerseAddress[];

    network: {
      bitcoin: { name: 'Mainnet' };
      spark: { name: 'mainnet' };
      stacks: { name: 'mainnet' };
    };
  };
};
export type XVerseEvent = {
  addresses: XVerseAddress[];
  type: 'accountChange';
};

export type ProviderObject = {
  [LegacyNetworks.BTC]: ProviderAPI;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
