import type { ProviderAPI } from '@hub3js/bip122';
import type { UTXO_NAMESPACE } from '@hub3js/namespaces';
import type { InstanceMap } from '@hub3js/std/types';

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
  [UTXO_NAMESPACE]: ProviderAPI;
};
export type Provider = InstanceMap<ProviderObject>;
