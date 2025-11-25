import type { OkxBtcAddress, Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

export function okx(): Provider | null {
  const { okxwallet } = window;
  if (!okxwallet) {
    return null;
  }
  const instances: Provider = new Map();
  if (okxwallet) {
    instances.set(LegacyNetworks.ETHEREUM, okxwallet);
  }
  if (okxwallet.solana) {
    instances.set(LegacyNetworks.SOLANA, okxwallet.solana);
  }
  if (okxwallet.bitcoin) {
    instances.set(LegacyNetworks.BTC, okxwallet.bitcoin);
  }
  return instances;
}

export function getInstanceOrThrow(): Provider {
  const instances = okx();

  if (!instances) {
    throw new Error('OKX Wallet is not injected. Please check your wallet.');
  }

  return instances;
}

export function evmOKX(): EvmProviderApi {
  const instances = okx();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'OKX Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaOKX(): SolanaProviderApi {
  const instance = okx();
  const solanaInstance = instance?.get(LegacyNetworks.SOLANA);

  if (!solanaInstance) {
    throw new Error(
      'OKX Wallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance as SolanaProviderApi;
}
export function bitcoinOKX(): UtxoProviderApi {
  const instance = okx();
  const bitcoinInstance = instance?.get(LegacyNetworks.BTC);

  if (!bitcoinInstance) {
    throw new Error(
      'OKX Wallet not injected or Utxo not enabled. Please check your wallet.'
    );
  }

  return bitcoinInstance as UtxoProviderApi;
}
export async function getBitcoinAccounts(): Promise<OkxBtcAddress> {
  const instance = bitcoinOKX();
  const requestResult = await instance.connect();

  if (requestResult.error?.message) {
    throw new Error(requestResult.error.message);
  }

  return requestResult;
}
