import type { Hub } from '@hub3js/core';

import { Hub3Error } from '@hub3js/core';
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

function unexpectedError() {
  return new Hub3Error('PROVIDER_UNEXPECTED', 'Something went wrong', {
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

  it('report a saved namespace that fails to reconnect with an unexpected error', async () => {
    const error = unexpectedError();
    const solana = fakeNamespace('Solana', {
      connect: vi.fn(async () => Promise.reject(error)),
    });
    const sui = fakeNamespace('Sui');

    runAutoConnect([solana, sui]);
    await settle(() => expect(sui.connect).toHaveBeenCalled());

    expect(logError).toHaveBeenCalledOnce();
    expect(logError).toHaveBeenCalledWith(error, {
      tags: {
        name: 'Hub3Error',
        type: 'PROVIDER_UNEXPECTED',
        walletType: WALLET,
        namespace: 'Solana',
        origin: 'auto',
      },
    });
  });

  it('report a plain error with the auto origin and no type', async () => {
    const error = new Error('Before hook failed');
    const solana = fakeNamespace('Solana', {
      connect: vi.fn(async () => Promise.reject(error)),
    });
    const sui = fakeNamespace('Sui');

    runAutoConnect([solana, sui]);
    await settle(() => expect(sui.connect).toHaveBeenCalled());

    expect(logError).toHaveBeenCalledOnce();
    expect(logError).toHaveBeenCalledWith(error, {
      tags: {
        name: 'Error',
        walletType: WALLET,
        namespace: 'Solana',
        origin: 'auto',
      },
    });
  });

  it.each(['PROVIDER_USER_REJECTED_REQUEST', 'PROVIDER_LOCKED'] as const)(
    'skip a namespace that fails with %s',
    async (type) => {
      const solana = fakeNamespace('Solana', {
        connect: vi.fn(async () => Promise.reject(new Hub3Error(type))),
      });
      const sui = fakeNamespace('Sui');

      runAutoConnect([solana, sui]);
      await settle(() => expect(sui.connect).toHaveBeenCalled());

      expect(logError).not.toHaveBeenCalled();
    }
  );

  it('skip a namespace that fails its eager connect check', async () => {
    const solana = fakeNamespace('Solana', {
      canEagerConnect: vi.fn(async () => Promise.reject(unexpectedError())),
    });
    const sui = fakeNamespace('Sui');

    runAutoConnect([solana, sui]);
    await settle(() => expect(sui.connect).toHaveBeenCalled());

    expect(solana.connect).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it('report only the namespace failure when no namespace connects', async () => {
    runAutoConnect([
      fakeNamespace('Solana', {
        connect: vi.fn(async () => Promise.reject(unexpectedError())),
      }),
    ]);
    await settle(() =>
      expect(console.warn).toHaveBeenCalledWith(
        new Error(`No namespace connected for ${WALLET}`)
      )
    );

    expect(logError).toHaveBeenCalledOnce();
    expect(logError).toHaveBeenCalledWith(
      expect.any(Hub3Error),
      expect.objectContaining({
        tags: expect.objectContaining({ namespace: 'Solana', origin: 'auto' }),
      })
    );
  });
});
