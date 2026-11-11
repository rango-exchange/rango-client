import type { LedgerSolanaWallet } from './types.js';
import type { ProviderAPI } from '@hub3js/evm';

import { getWallets } from '@wallet-standard/app';

import {
  SOLANA_WALLET_STANDARD_MAINNET,
  SOLANA_WALLET_STANDARD_NAME,
} from './constants.js';

/*
 * The Ledger Wallet Provider (Ledger Button) hands us an EIP-1193 provider
 * through the EIP-6963 announce event. We stash it here so the EVM namespace
 * actions and the signer can reach it. It's typed as hub3's `ProviderAPI`
 * (itself an `EIP1193Provider`) so it plugs straight into `actions.*`.
 */
let provider: ProviderAPI | undefined;

export function setProvider(p: ProviderAPI) {
  provider = p;
}

export function getProvider(): ProviderAPI {
  if (!provider) {
    throw new Error(
      'Ledger Wallet provider is not set. Make sure the Ledger Button has announced itself over EIP-6963.'
    );
  }
  return provider;
}

/*
 * Unlike EVM, the Solana wallet isn't announced through an event we stash. It
 * registers itself through the Wallet Standard when `initializeLedgerProvider`
 * runs (and only if Solana is enabled for the dApp on Ledger's side), so we
 * look it up on demand.
 */
export function getSolanaWallet(): LedgerSolanaWallet {
  const wallet = getWallets()
    .get()
    .find(
      (wallet) =>
        wallet.name === SOLANA_WALLET_STANDARD_NAME &&
        wallet.chains.includes(SOLANA_WALLET_STANDARD_MAINNET)
    );

  if (!wallet) {
    throw new Error(
      'Ledger Wallet Solana instance is not available. Make sure Solana is enabled for your dApp identifier.'
    );
  }

  return wallet as LedgerSolanaWallet;
}
