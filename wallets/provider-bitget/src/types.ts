import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type {
  EVM_NAMESPACE,
  TRON_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import type { ProviderAPI as TronProviderApi } from '@rango-dev/wallets-core/namespaces/tron';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

export type ProviderObject = {
  [EVM_NAMESPACE]: EvmProviderApi;
  [TRON_NAMESPACE]: TronProviderApi;
  [UTXO_NAMESPACE]: UtxoProviderApi;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;

export type TronChangeAccountEvent = {
  isBitkeep: boolean;
  message: {
    action: string;
    data: {
      address: string;
    };
  };
};
