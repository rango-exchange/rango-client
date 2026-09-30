import type { Hub } from '@hub3js/core';

import { ConnectionErrorType, WalletConnectionError } from '@hub3js/std/utils';
import { error as logError } from '@rango-dev/logging-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { autoConnect } from './autoConnect.js';
import { HUB_LAST_CONNECTED_WALLETS } from './constants.js';

vi.mock('@rango-dev/logging-core', () => ({
  error: vi.fn(),
}));

const WALLET = 'phantom';

type FakeNamespace = {
  namespaceId: string;
  canEagerConnect: () => Promise<boolean>;
  connect: () => Promise<string[]>;
};

function unknownConnectionError() {
  return new WalletConnectionError('Something went wrong', {
    type: ConnectionErrorType.Unknown,
    cause: new Error('Something went wrong'),
  });
}

function fakeNamespace(
  namespaceId: string,
  overrides: Partial<FakeNamespace> = {}
): FakeNamespace {
  return {
    namespaceId,
    canEagerConnect: vi.fn(async () => true),
    connect: vi.fn(async () => [`${namespaceId}:address`]),
    ...overrides,
  };
}

function runAutoConnect(namespaces: FakeNamespace[]) {
  localStorage.setItem(
    HUB_LAST_CONNECTED_WALLETS,
    JSON.stringify({
      [WALLET]: namespaces.map((namespace) => ({
        namespace: namespace.namespaceId,
        network: undefined,
      })),
    })
  );

  const wallet = {
    id: WALLET,
    findByNamespace: (namespaceId: string) =>
      namespaces.find((namespace) => namespace.namespaceId === namespaceId),
  };
  const hub = { get: (type: string) => (type === WALLET ? wallet : undefined) };

  void autoConnect({
    getHub: () => hub as unknown as Hub,
    allBlockChains: [],
  });
}

// `autoConnect` resolves before its per-wallet work finishes, so wait for a visible effect and let the rest settle.
async function settle(condition: () => void) {
  await vi.waitFor(condition);
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('autoConnect', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(logError).mockClear();
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('report a saved namespace that fails to reconnect with an unknown connection error', async () => {
    const error = unknownConnectionError();
    const solana = fakeNamespace('Solana', {
      connect: vi.fn(async () => Promise.reject(error)),
    });
    const sui = fakeNamespace('Sui');

    runAutoConnect([solana, sui]);
    await settle(() => expect(sui.connect).toHaveBeenCalled());

    expect(logError).toHaveBeenCalledOnce();
    expect(logError).toHaveBeenCalledWith(error, {
      tags: {
        name: 'WalletConnectionError',
        type: ConnectionErrorType.Unknown,
        walletType: WALLET,
        namespace: 'Solana',
        origin: 'auto',
      },
    });
  });

  it('skip a namespace that fails its eager connect check', async () => {
    const solana = fakeNamespace('Solana', {
      canEagerConnect: vi.fn(async () =>
        Promise.reject(unknownConnectionError())
      ),
    });
    const sui = fakeNamespace('Sui');

    runAutoConnect([solana, sui]);
    await settle(() => expect(sui.connect).toHaveBeenCalled());

    expect(solana.connect).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it('report only the namespace failure when no namespace connects', async () => {
    const solana = fakeNamespace('Solana', {
      connect: vi.fn(async () => Promise.reject(unknownConnectionError())),
    });

    runAutoConnect([solana]);
    await settle(() =>
      expect(console.warn).toHaveBeenCalledWith(
        new Error(`No namespace connected for ${WALLET}`)
      )
    );

    expect(logError).toHaveBeenCalledOnce();
    expect(logError).toHaveBeenCalledWith(
      expect.any(WalletConnectionError),
      expect.objectContaining({
        tags: expect.objectContaining({ namespace: 'Solana' }),
      })
    );
  });
});
