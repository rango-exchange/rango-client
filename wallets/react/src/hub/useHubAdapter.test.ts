import type { NamespaceInputForConnect } from '../legacy/types.js';
import type { ProviderContext } from '../types.js';
import type { Provider } from '@hub3js/core';

import { NamespaceBuilder, ProviderBuilder } from '@hub3js/core';
import {
  USER_REJECTION_ERROR_CODE,
  WALLET_LOCKED_ERROR_CODE,
} from '@hub3js/std/utils';
import { act, renderHook } from '@testing-library/react-hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WalletConnectionAttemptError } from '../errors.js';

import { useHubAdapter } from './useHubAdapter.js';

type TestActions = {
  connect: (...args: unknown[]) => Promise<string[]>;
};

type NamespaceConnect = () => Promise<string[]>;

const evm: NamespaceInputForConnect = { namespace: 'EVM', network: 'ETH' };
const solana: NamespaceInputForConnect = {
  namespace: 'Solana',
  network: undefined,
};
const sui: NamespaceInputForConnect = { namespace: 'Sui', network: undefined };

function rejection() {
  return Object.assign(new Error('User rejected the request.'), {
    code: USER_REJECTION_ERROR_CODE,
  });
}

function lockedWallet() {
  return Object.assign(new Error('The device is locked'), {
    code: WALLET_LOCKED_ERROR_CODE,
  });
}

function buildProvider(
  walletType: string,
  connects: Record<string, NamespaceConnect>
): Provider {
  const providerBuilder = new ProviderBuilder<unknown>(walletType).config(
    'metadata',
    {
      name: walletType,
      icon: 'https://example.com/icon.svg',
      extensions: { homepage: 'https://example.com' },
    }
  );

  Object.entries(connects).forEach(([namespaceId, connect]) => {
    const namespace = new NamespaceBuilder<TestActions>(namespaceId, walletType)
      .action('connect', async () => connect())
      .build();
    providerBuilder.add(namespaceId, namespace);
  });

  return providerBuilder.build();
}

function renderAdapter(providers: Provider[]): ProviderContext {
  return renderHook(() => useHubAdapter({ providers })).result.current;
}

async function connectAndCatch(
  api: ProviderContext,
  walletType: string,
  namespaces: NamespaceInputForConnect[]
): Promise<WalletConnectionAttemptError> {
  let thrown: unknown;
  await act(async () => {
    thrown = await api.connect(walletType, namespaces).then(
      () => undefined,
      (error: unknown) => error
    );
  });
  expect(thrown).toBeInstanceOf(WalletConnectionAttemptError);
  return thrown as WalletConnectionAttemptError;
}

describe('useHubAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('connect', () => {
    it('abandon the namespaces still waiting after a rejection', async () => {
      const solanaConnect = vi.fn(async () => []);
      const suiConnect = vi.fn(async () => []);
      const api = renderAdapter([
        buildProvider('phantom', {
          EVM: async () => Promise.reject(rejection()),
          Solana: solanaConnect,
          Sui: suiConnect,
        }),
      ]);

      await connectAndCatch(api, 'phantom', [evm, solana, sui]);

      expect(solanaConnect).not.toHaveBeenCalled();
      expect(suiConnect).not.toHaveBeenCalled();
    });

    it('leave the namespaces abandoned after a rejection out of errors', async () => {
      const api = renderAdapter([
        buildProvider('phantom', {
          EVM: async () => Promise.reject(rejection()),
          Solana: async () => Promise.reject(new Error('Solana failed')),
          Sui: async () => Promise.reject(new Error('Sui failed')),
        }),
      ]);

      const error = await connectAndCatch(api, 'phantom', [evm, solana, sui]);

      expect(error.errors).toHaveLength(1);
      expect(error.errors[0]).toMatchObject({
        namespace: 'EVM',
        code: USER_REJECTION_ERROR_CODE,
      });
    });

    it('keep the namespaces abandoned after a rejection in the requested namespaces', async () => {
      const api = renderAdapter([
        buildProvider('phantom', {
          EVM: async () => Promise.reject(rejection()),
          Solana: async () => [],
          Sui: async () => [],
        }),
      ]);

      const error = await connectAndCatch(api, 'phantom', [evm, solana, sui]);

      expect(error.requestedNamespaces).toEqual([evm, solana, sui]);
    });

    it('keep connecting the waiting namespaces after a locked wallet', async () => {
      const solanaConnect = vi.fn(async () => []);
      const api = renderAdapter([
        buildProvider('ledger', {
          EVM: async () => Promise.reject(lockedWallet()),
          Solana: solanaConnect,
        }),
      ]);

      const error = await connectAndCatch(api, 'ledger', [evm, solana]);

      expect(solanaConnect).toHaveBeenCalledTimes(1);
      expect(error.errors).toHaveLength(1);
      expect(error.errors[0]).toMatchObject({
        namespace: 'EVM',
        code: WALLET_LOCKED_ERROR_CODE,
      });
    });

    it('keep connecting the waiting namespaces of other wallets after a rejection', async () => {
      let finishMetamaskEvm: (accounts: string[]) => void = () => undefined;
      const metamaskEvmFinished = new Promise<string[]>((resolve) => {
        finishMetamaskEvm = resolve;
      });
      const metamaskSolanaConnect = vi.fn(async () => []);
      const api = renderAdapter([
        buildProvider('phantom', {
          EVM: async () => Promise.reject(rejection()),
          Solana: async () => [],
        }),
        buildProvider('metamask', {
          EVM: async () => metamaskEvmFinished,
          Solana: metamaskSolanaConnect,
        }),
      ]);

      await act(async () => {
        const metamask = api.connect('metamask', [evm, solana]);
        await api.connect('phantom', [evm, solana]).catch(() => undefined);
        finishMetamaskEvm([]);
        await metamask;
      });

      expect(metamaskSolanaConnect).toHaveBeenCalledTimes(1);
    });
  });
});
