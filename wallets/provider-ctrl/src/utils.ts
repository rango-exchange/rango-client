import type { Provider, UtxoProvider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { CaipAccount } from '@hub3js/std/types';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

import { CAIP_CHAINS } from '@hub3js/caip';
import {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import { getChainIdFromCaip2ChainId } from '@hub3js/std/utils';
import { utils } from '@rango-dev/wallets-core/namespaces/utxo';

import { UTXO_CHAINS } from './constants.js';

export function ctrl(): Provider | null {
  const { ctrl } = window;

  if (!ctrl) {
    return null;
  }

  const instances: Provider = new Map();
  const utxoInstances: UtxoProvider = new Map();

  if (ctrl.ethereum) {
    instances.set(EVM_NAMESPACE, ctrl.ethereum);
  }
  if (ctrl.bitcoin) {
    utxoInstances.set(CAIP_CHAINS.BITCOIN, ctrl.bitcoin);
  }
  if (ctrl.litecoin) {
    utxoInstances.set(CAIP_CHAINS.LITECOIN, ctrl.litecoin);
  }
  if (ctrl.dogecoin) {
    utxoInstances.set(CAIP_CHAINS.DOGECOIN, ctrl.dogecoin);
  }
  if (ctrl.bitcoincash) {
    utxoInstances.set(CAIP_CHAINS.BITCOINCASH, ctrl.bitcoincash);
  }
  if (utxoInstances.size > 0) {
    instances.set(UTXO_NAMESPACE, utxoInstances);
  }
  if (ctrl.solana) {
    instances.set(SOLANA_NAMESPACE, ctrl.solana);
  }

  if (instances.size === 0) {
    return null;
  }

  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = ctrl();

  if (!instances) {
    throw new Error('Ctrl is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmCtrl(): EvmProviderApi {
  const instances = ctrl();
  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'Ctrl not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaCtrl(): SolanaProviderApi {
  const instances = ctrl();
  const solanaInstance = instances?.get(SOLANA_NAMESPACE);

  if (!solanaInstance) {
    throw new Error(
      'Ctrl not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}

/**
 * The EVM instance, used as the trigger source for UTXO account changes.
 *
 * Ctrl switches the active account across every chain at once but only signals it
 * reliably through the EVM provider's `accountsChanged` (the UTXO providers emit an
 * empty `{}` payload, and re-fetching them while disconnected opens a wallet popup).
 * Returns an empty object when EVM isn't injected so the subscriber attaches safely.
 */
export function evmEventSource(): EvmProviderApi {
  return (ctrl()?.get(EVM_NAMESPACE) ?? {}) as EvmProviderApi;
}

/** Promisified `request_accounts` for a callback-style ctrl UTXO instance. */
async function requestUtxoAccounts(
  instance: UtxoProviderApi
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    instance.request(
      { method: 'request_accounts', params: [] },
      (error: unknown, accounts: unknown) => {
        if (error) {
          reject(error);
          return;
        }
        resolve((accounts as string[]) ?? []);
      }
    );
  });
}

/**
 * Fetch and CAIP-format accounts across every available UTXO chain, merged into a
 * single array. Each account encodes its own chain via its CAIP reference, so
 * BTC/LTC/DOGE/BCH addresses coexist in one UTXO namespace. Silent while the wallet
 * is connected (only called on connect / switch, never on disconnect).
 */
export async function getAllUtxoAccounts(): Promise<CaipAccount[]> {
  const instances = ctrl();
  if (!instances) {
    return [];
  }

  /*
   * `Promise.all` rejects as soon as any chain's `request_accounts` fails, discarding
   * the rest and propagating that error — we don't want to silently return a partial
   * account set if one chain errors.
   */
  const utxoInstances = instances.get(UTXO_NAMESPACE) as
    | UtxoProvider
    | undefined;
  if (!utxoInstances) {
    return [];
  }

  const perChain = await Promise.all(
    UTXO_CHAINS.filter((chainId) => utxoInstances.get(chainId)).map(
      async (chainId) => {
        const instance = utxoInstances.get(chainId) as UtxoProviderApi;
        const accounts = await requestUtxoAccounts(instance);
        return utils.formatAccountsToCAIP(
          accounts,
          getChainIdFromCaip2ChainId(chainId)
        );
      }
    )
  );

  return perChain.flat();
}
