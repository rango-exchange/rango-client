import type {
  ConnectResult,
  NamespaceInputForConnect,
} from '@rango-dev/wallets-react';

import { WalletConnectionError } from '@hub3js/std/utils';
import { error as logError } from '@rango-dev/logging-core';
import { WalletConnectionAttemptError } from '@rango-dev/wallets-react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useConnectWithLogging } from './useConnectWithLogging';

const { connect } = vi.hoisted(() => ({ connect: vi.fn() }));

vi.mock('@rango-dev/logging-core', () => ({ error: vi.fn() }));
vi.mock('@rango-dev/wallets-react', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  useWallets: () => ({ connect }),
}));

const loggedError = vi.mocked(logError);

const THREE_MINUTES = 180_000;

const NAMESPACES: NamespaceInputForConnect[] = [
  { namespace: 'EVM', network: undefined },
];

const CONNECTED: ConnectResult[] = [{ accounts: [], network: null }];

type ConnectWithLogging = ReturnType<typeof useConnectWithLogging>;

async function pending(): Promise<ConnectResult[]> {
  return new Promise<ConnectResult[]>(() => undefined);
}

function failedAttempt(): WalletConnectionAttemptError {
  return new WalletConnectionAttemptError({
    errors: [
      new WalletConnectionError({ namespace: 'EVM', cause: new Error('boom') }),
    ],
    requestedNamespaces: NAMESPACES,
  });
}

function renderConnect(): ConnectWithLogging {
  let rendered: ConnectWithLogging | undefined;
  function Probe() {
    rendered = useConnectWithLogging();
    return null;
  }

  renderToStaticMarkup(createElement(Probe));

  if (!rendered) {
    throw new Error('The hook was not rendered.');
  }

  return rendered;
}

beforeEach(() => {
  loggedError.mockReset();
  connect.mockReset();
  connect.mockResolvedValue(CONNECTED);
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('connecting without a trigger', () => {
  it('calls connect with the same wallet type and namespaces and resolves with its result', async () => {
    await expect(renderConnect()('metamask', NAMESPACES)).resolves.toBe(
      CONNECTED
    );

    expect(connect).toHaveBeenCalledWith('metamask', NAMESPACES);
  });

  it('logs nothing when the attempt fails and rethrows its error unchanged', async () => {
    const received = failedAttempt();
    connect.mockRejectedValue(received);

    await expect(renderConnect()('metamask', NAMESPACES)).rejects.toBe(
      received
    );

    expect(loggedError).not.toHaveBeenCalled();
  });

  it('logs nothing when the attempt is still pending after three minutes', () => {
    connect.mockReturnValue(pending());

    void renderConnect()('metamask', NAMESPACES);
    vi.advanceTimersByTime(THREE_MINUTES);

    expect(loggedError).not.toHaveBeenCalled();
  });
});

describe('connecting with a trigger', () => {
  it('logs the error the attempt failed with, tagged with the trigger, and rethrows it unchanged', async () => {
    const received = failedAttempt();
    connect.mockRejectedValue(received);

    await expect(
      renderConnect()('metamask', NAMESPACES, {
        trigger: 'swap-details-reconnect',
      })
    ).rejects.toBe(received);

    expect(connect).toHaveBeenCalledWith('metamask', NAMESPACES);
    expect(loggedError).toHaveBeenCalledTimes(1);
    expect(loggedError.mock.calls[0]?.[0]).toBe(received);
    expect(loggedError.mock.calls[0]?.[1]?.tags).toEqual({
      walletType: 'metamask',
      namespaces: 'EVM',
      trigger: 'swap-details-reconnect',
      category: 'wallet',
    });
  });

  it('logs a timeout when the attempt is still pending after three minutes', () => {
    connect.mockReturnValue(pending());

    void renderConnect()('metamask', NAMESPACES, { trigger: 'wallets-page' });
    vi.advanceTimersByTime(THREE_MINUTES);

    expect(loggedError).toHaveBeenCalledTimes(1);
    expect(loggedError.mock.calls[0]?.[1]?.tags).toEqual(
      expect.objectContaining({ trigger: 'wallets-page', category: 'timeout' })
    );
  });
});
