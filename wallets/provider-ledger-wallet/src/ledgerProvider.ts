import type { ProviderAPI } from '@hub3js/evm';

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
