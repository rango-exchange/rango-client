import type { TonProviderApi } from './namespaces/ton/types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  TON_NAMESPACE,
  TRON_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { ProviderAPI as TronProviderApi } from '@rango-dev/wallets-core/namespaces/tron';
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
  [TRON_NAMESPACE]: TronProviderApi;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;

/*
 * On `accountsChanged`, `data.address` is the new base58 address, or `false`
 * when disconnected; on `disconnect`, `data` is absent.
 */
export type OkxTronMessageEvent = {
  message: {
    action: string;
    data?: {
      address: string | false;
    };
  };
};
