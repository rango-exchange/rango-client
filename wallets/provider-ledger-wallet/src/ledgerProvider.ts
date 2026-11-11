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

type JsonRpcEnvelope = {
  jsonrpc: string;
  id?: number | string | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
};

function isJsonRpcEnvelope(value: unknown): value is JsonRpcEnvelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    'jsonrpc' in value &&
    ('result' in value || 'error' in value)
  );
}

/*
 * For some methods (e.g. `eth_call`), the Ledger provider resolves `request`
 * with the whole JSON-RPC response (`{ jsonrpc, id, result }`) instead of just
 * `result` as EIP-1193 requires. We unwrap it here so hub3's shared `actions.*`
 * receive spec-compliant values.
 */
function withUnwrappedResponses(p: ProviderAPI): ProviderAPI {
  return new Proxy(p, {
    get(target, prop) {
      if (prop === 'request') {
        return async (args: Parameters<ProviderAPI['request']>[0]) => {
          const response: unknown = await target.request(args);

          if (!isJsonRpcEnvelope(response)) {
            return response;
          }

          if (response.error) {
            throw Object.assign(new Error(response.error.message), {
              code: response.error.code,
              data: response.error.data,
            });
          }

          return response.result;
        };
      }

      const value = Reflect.get(target, prop, target);
      // Bind to the real provider so methods relying on private fields keep working.
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

export function setProvider(p: ProviderAPI) {
  provider = withUnwrappedResponses(p);
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
