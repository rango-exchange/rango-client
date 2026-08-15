import type { TonProviderApi } from './namespaces/ton/types.js';
import type { OkxBtcAddress, Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

import {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  UTXO_NAMESPACE,
  TON_NAMESPACE,
} from '@hub3js/namespaces';

export function okx(): Provider | null {
  const { okxwallet, okxTonWallet } = window;
  if (!okxwallet && !okxTonWallet) {
    return null;
  }
  const instances: Provider = new Map();
  if (okxwallet) {
    instances.set(EVM_NAMESPACE, okxwallet);
  }
  if (okxwallet.solana) {
    instances.set(SOLANA_NAMESPACE, okxwallet.solana);
  }
  if (okxwallet.bitcoin) {
    instances.set(UTXO_NAMESPACE, okxwallet.bitcoin);
  }
  if (okxTonWallet?.tonconnect) {
    instances.set(TON_NAMESPACE, okxTonWallet.tonconnect);
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

  const evmInstance = instances?.get(EVM_NAMESPACE);

  if (!evmInstance) {
    throw new Error(
      'OKX Wallet not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}

export function solanaOKX(): SolanaProviderApi {
  const instance = okx();
  const solanaInstance = instance?.get(SOLANA_NAMESPACE);

  if (!solanaInstance) {
    throw new Error(
      'OKX Wallet not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}
export function bitcoinOKX(): UtxoProviderApi {
  const instance = okx();
  const bitcoinInstance = instance?.get(UTXO_NAMESPACE);

  if (!bitcoinInstance) {
    throw new Error(
      'OKX Wallet not injected or Utxo not enabled. Please check your wallet.'
    );
  }

  return bitcoinInstance;
}

export function tonOKX(): TonProviderApi {
  const instance = okx();
  const tonInstance = instance?.get(TON_NAMESPACE);

  if (!tonInstance) {
    throw new Error(
      'OKX Wallet not injected or TON not enabled. Please check your wallet.'
    );
  }

  return tonInstance as TonProviderApi;
}

export async function getBitcoinAccounts(): Promise<OkxBtcAddress> {
  const instance = bitcoinOKX();
  const requestResult = await instance.connect();

  if (requestResult.error?.message) {
    throw new Error(requestResult.error.message);
  }

  return requestResult;
}
