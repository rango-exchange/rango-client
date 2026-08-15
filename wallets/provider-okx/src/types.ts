import type { TonProviderApi } from './namespaces/ton/types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  UTXO_NAMESPACE,
  TON_NAMESPACE,
} from '@hub3js/namespaces';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

export type OkxBtcAddress = {
  address: string;
  publicKey: string;
  compressedPublicKey: string;
};

export type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
  [SOLANA_NAMESPACE]: SolanaProviderApi;
  [UTXO_NAMESPACE]: UtxoProviderApi;
  [TON_NAMESPACE]: TonProviderApi;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
