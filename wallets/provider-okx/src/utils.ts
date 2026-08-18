import type { TonProviderApi } from './namespaces/ton/types.js';
import type { OkxBtcAddress, OkxTronMessageEvent, Provider } from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@hub3js/evm';
import type { ProviderAPI as SolanaProviderApi } from '@hub3js/solana';
import type { ProviderAPI as SuiProviderApi } from '@hub3js/sui';
import type { ProviderAPI as TronProviderApi } from '@rango-dev/wallets-core/namespaces/tron';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';

import {
  EVM_NAMESPACE,
  SOLANA_NAMESPACE,
  TON_NAMESPACE,
  TRON_NAMESPACE,
  UTXO_NAMESPACE,
} from '@hub3js/namespaces';
import { getInstanceOrThrow as getSuiInstanceOrThrow } from '@hub3js/sui';

import { WALLET_NAME_IN_WALLET_STANDARD } from './constants.js';

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
  if (okxwallet.tronLink) {
    instances.set(TRON_NAMESPACE, okxwallet.tronLink);
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

export function tronOKX(): TronProviderApi {
  const instance = okx();
  const tronInstance = instance?.get(TRON_NAMESPACE);

  if (!tronInstance) {
    throw new Error(
      'OKX Wallet not injected or Tron not enabled. Please check your wallet.'
    );
  }

  return tronInstance;
}

export function suiWalletInstance(): SuiProviderApi | null {
  try {
    return getSuiInstanceOrThrow(WALLET_NAME_IN_WALLET_STANDARD);
  } catch {
    return null;
  }
}

export function suiWalletInstanceOrThrow(): SuiProviderApi {
  return getSuiInstanceOrThrow(WALLET_NAME_IN_WALLET_STANDARD);
}
export async function getBitcoinAccounts(): Promise<OkxBtcAddress> {
  const instance = bitcoinOKX();
  const requestResult = await instance.connect();

  if (requestResult.error?.message) {
    throw new Error(requestResult.error.message);
  }

  return requestResult;
}

export function isOkxTronMessageEvent(
  value: unknown
): value is OkxTronMessageEvent {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const event = value as { message?: { action?: unknown } };
  return (
    typeof event.message === 'object' &&
    event.message !== null &&
    typeof event.message.action === 'string'
  );
}
