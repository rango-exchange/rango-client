import type { Provider, UtxoNetwork } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { CaipAccount } from '@hub3js/std/types';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import {
  CAIP_BITCOIN_CHAIN_ID,
  CAIP_BITCOINCASH_CHAIN_ID,
  CAIP_DOGECOIN_CHAIN_ID,
  CAIP_LITECOIN_CHAIN_ID,
  utils,
} from '@rango-dev/wallets-core/namespaces/utxo';

/**
 * The UTXO chains Ctrl exposes, grouped under the single UTXO namespace, each
 * paired with its CAIP-2 (bip122) reference so accounts can be self-describing.
 */
export const UTXO_CHAINS: { network: UtxoNetwork; caip: string }[] = [
  { network: LegacyNetworks.BTC, caip: CAIP_BITCOIN_CHAIN_ID },
  { network: LegacyNetworks.LTC, caip: CAIP_LITECOIN_CHAIN_ID },
  { network: LegacyNetworks.DOGE, caip: CAIP_DOGECOIN_CHAIN_ID },
  { network: LegacyNetworks.BCH, caip: CAIP_BITCOINCASH_CHAIN_ID },
];

export function ctrl(): Provider | null {
  const { ctrl } = window;

  if (!ctrl) {
    return null;
  }

  const instances: Provider = new Map();

  if (ctrl.ethereum) {
    instances.set(LegacyNetworks.ETHEREUM, ctrl.ethereum);
  }
  if (ctrl.bitcoin) {
    instances.set(LegacyNetworks.BTC, ctrl.bitcoin);
  }
  if (ctrl.litecoin) {
    instances.set(LegacyNetworks.LTC, ctrl.litecoin);
  }
  if (ctrl.dogecoin) {
    instances.set(LegacyNetworks.DOGE, ctrl.dogecoin);
  }
  if (ctrl.bitcoincash) {
    instances.set(LegacyNetworks.BCH, ctrl.bitcoincash);
  }
  if (ctrl.solana) {
    instances.set(LegacyNetworks.SOLANA, ctrl.solana);
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
  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Ctrl not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaCtrl(): SolanaProviderApi {
  const instances = ctrl();
  const solanaInstance = instances?.get(LegacyNetworks.SOLANA);

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
  return (ctrl()?.get(LegacyNetworks.ETHEREUM) ?? {}) as EvmProviderApi;
}

/** Promisified `request_accounts` for a callback-style ctrl UTXO instance. */
export async function requestUtxoAccounts(
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

  const perChain = await Promise.all(
    UTXO_CHAINS.filter(({ network }) => instances.get(network)).map(
      async ({ network, caip }) => {
        const instance = instances.get(network) as UtxoProviderApi;
        const accounts = await requestUtxoAccounts(instance).catch(() => []);
        return utils.formatAccountsToCAIP(accounts, caip);
      }
    )
  );

  return perChain.flat();
}
