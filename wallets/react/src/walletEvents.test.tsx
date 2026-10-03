import type {
  Emitter,
  ProviderProps,
  WalletEventData,
  WalletEvents,
} from './index.js';
import type { Provider as HubProvider } from '@hub3js/core';
import type { EvmBlockchainMeta } from 'rango-types';

import { NamespaceBuilder, ProviderBuilder } from '@hub3js/core';
import { garbageWalletMetaData } from '@hub3js/core/test-utils';
import { act, renderHook } from '@testing-library/react-hooks/dom';
import { TransactionType } from 'rango-types';
import React from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  Provider,
  useWallets,
  WalletEventChannel,
  WalletEventTypes,
} from './index.js';

const LAST_CONNECTED_WALLETS_KEY = 'hub-v1-last-connected-wallets';
const EVM_ACCOUNT = 'eip155:1:0x000000000000000000000000000000000000dEaD';
const SOLANA_ACCOUNT =
  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:11111111111111111111111111111111';

function createEvmBlockchain(name: string, chainId: string): EvmBlockchainMeta {
  return {
    name,
    shortName: name,
    displayName: name,
    defaultDecimals: 18,
    addressPatterns: [],
    logo: '',
    color: '#000000',
    sort: 1,
    enabled: true,
    feeAssets: [],
    type: TransactionType.EVM,
    chainId,
    info: {
      infoType: 'EvmMetaInfo',
      chainName: name,
      nativeCurrency: { name, symbol: name, decimals: 18 },
      rpcUrls: [],
      blockExplorerUrls: [],
      addressUrl: '',
      transactionUrl: '',
      enableGasV2: false,
      tokenUrl: '',
    },
  };
}

const allBlockChains = [
  createEvmBlockchain('ETH', '0x1'),
  createEvmBlockchain('POLYGON', '0x89'),
];

type NamespaceBehaviour = {
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
  canEagerConnect?: () => Promise<boolean>;
};

interface TestActions {
  connect: (...args: unknown[]) => Promise<unknown>;
  disconnect: () => Promise<void>;
  canEagerConnect: () => Promise<boolean>;
}

function buildNamespace(
  namespaceId: 'EVM' | 'Solana',
  walletId: string,
  behaviour: NamespaceBehaviour
) {
  return new NamespaceBuilder<TestActions>(namespaceId, walletId)
    .action('connect', async (context) => {
      await behaviour.connect?.();
      const [, setState] = context.state();
      setState('connected', true);
      if (namespaceId === 'EVM') {
        setState('accounts', [EVM_ACCOUNT]);
        setState('network', '0x1');
        return { accounts: [EVM_ACCOUNT], network: '0x1' };
      }
      setState('accounts', [SOLANA_ACCOUNT]);
      return [SOLANA_ACCOUNT];
    })
    .action('disconnect', async (context) => {
      await behaviour.disconnect?.();
      const [, setState] = context.state();
      setState('connected', false);
      setState('accounts', null);
    })
    .action(
      'canEagerConnect',
      async () => (await behaviour.canEagerConnect?.()) ?? true
    )
    .build();
}

function buildWallet(
  walletId: string,
  namespaces: {
    evm?: NamespaceBehaviour;
    solana?: NamespaceBehaviour;
  } = {},
  options: { installed?: boolean } = {}
): HubProvider {
  return new ProviderBuilder(walletId)
    .config('metadata', garbageWalletMetaData)
    .init((context) => {
      const [, setState] = context.state();
      setState('installed', options.installed ?? true);
    })
    .add('evm', buildNamespace('EVM', walletId, namespaces.evm ?? {}))
    .add('solana', buildNamespace('Solana', walletId, namespaces.solana ?? {}))
    .build() as unknown as HubProvider;
}

function createRecordingEmitter() {
  const events: WalletEventData[] = [];
  const emitter: Emitter<WalletEvents> = {
    emit(type, event) {
      expect(type).toBe(WalletEventChannel);
      events.push(event);
    },
  };
  return { events, emitter };
}

// The hub detects the test wallets on render; connect and disconnect tests only look at the rest.
function withoutDetection(events: WalletEventData[]) {
  return events.filter(
    (event) => event.type !== WalletEventTypes.WALLET_DETECTED
  );
}

function renderWallets(props: Omit<ProviderProps, 'children'>) {
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <Provider {...props}>{children}</Provider>
  );
  return renderHook(() => useWallets(), { wrapper });
}

function rejectWith(error: unknown) {
  return async () => {
    throw error;
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe('manual connect', () => {
  test('emits initiated then connected or failed for each namespace', async () => {
    const { events, emitter } = createRecordingEmitter();
    const wallet = buildWallet('manual-mixed', {
      evm: {},
      solana: { connect: rejectWith(new Error('boom')) },
    });
    const { result } = renderWallets({
      providers: [wallet],
      allBlockChains,
      emitter,
    });

    await act(async () => {
      await expect(
        result.current.connect('manual-mixed', [
          { namespace: 'EVM', network: 'ETH' },
          { namespace: 'Solana', network: undefined },
        ])
      ).rejects.toThrow('boom');
    });

    expect(withoutDetection(events)).toEqual([
      {
        type: WalletEventTypes.WALLET_CONNECT_INITIATED,
        payload: {
          walletName: 'manual-mixed',
          namespace: 'EVM',
          chain: 'ETH',
          origin: 'manual',
        },
      },
      {
        type: WalletEventTypes.WALLET_CONNECTED,
        payload: {
          walletName: 'manual-mixed',
          namespace: 'EVM',
          chain: 'ETH',
          origin: 'manual',
        },
      },
      {
        type: WalletEventTypes.WALLET_CONNECT_INITIATED,
        payload: {
          walletName: 'manual-mixed',
          namespace: 'Solana',
          chain: null,
          origin: 'manual',
        },
      },
      {
        type: WalletEventTypes.WALLET_CONNECT_FAILED,
        payload: {
          walletName: 'manual-mixed',
          namespace: 'Solana',
          chain: null,
          origin: 'manual',
        },
      },
    ]);
  });

  test('reports the connected network, not the requested one, on success', async () => {
    const { events, emitter } = createRecordingEmitter();
    const { result } = renderWallets({
      providers: [buildWallet('manual-no-network')],
      allBlockChains,
      emitter,
    });

    await act(async () => {
      await result.current.connect('manual-no-network', [
        { namespace: 'EVM', network: undefined },
      ]);
    });

    expect(
      withoutDetection(events).map((event) => [event.type, event.payload])
    ).toEqual([
      [
        WalletEventTypes.WALLET_CONNECT_INITIATED,
        {
          walletName: 'manual-no-network',
          namespace: 'EVM',
          chain: null,
          origin: 'manual',
        },
      ],
      [
        WalletEventTypes.WALLET_CONNECTED,
        {
          walletName: 'manual-no-network',
          namespace: 'EVM',
          chain: 'ETH',
          origin: 'manual',
        },
      ],
    ]);
  });

  test('emits nothing for a namespace that is already connected', async () => {
    const { events, emitter } = createRecordingEmitter();
    const { result } = renderWallets({
      providers: [buildWallet('manual-reconnect')],
      allBlockChains,
      emitter,
    });

    await act(async () => {
      await result.current.connect('manual-reconnect', [
        { namespace: 'EVM', network: 'ETH' },
      ]);
    });
    events.length = 0;

    await act(async () => {
      await result.current.connect('manual-reconnect', [
        { namespace: 'EVM', network: 'POLYGON' },
      ]);
    });

    expect(events).toEqual([]);
  });

  test('emits nothing for namespaces cancelled after a rejection', async () => {
    const { events, emitter } = createRecordingEmitter();
    const rejection = Object.assign(new Error('User rejected'), { code: 4001 });
    const wallet = buildWallet('manual-cancelled', {
      evm: { connect: rejectWith(rejection) },
      solana: {},
    });
    const { result } = renderWallets({
      providers: [wallet],
      allBlockChains,
      emitter,
    });

    await act(async () => {
      await expect(
        result.current.connect('manual-cancelled', [
          { namespace: 'EVM', network: undefined },
          { namespace: 'Solana', network: undefined },
        ])
      ).rejects.toBe(rejection);
    });

    const payload = {
      walletName: 'manual-cancelled',
      namespace: 'EVM',
      chain: null,
      origin: 'manual',
    };
    expect(withoutDetection(events)).toEqual([
      { type: WalletEventTypes.WALLET_CONNECT_INITIATED, payload },
      { type: WalletEventTypes.WALLET_CONNECT_FAILED, payload },
    ]);
  });
});

describe('disconnect', () => {
  test('emits one event per namespace when its disconnect is initiated', async () => {
    const { events, emitter } = createRecordingEmitter();
    let finishEvmDisconnect: () => void = () => undefined;
    const wallet = buildWallet('disconnect-wallet', {
      evm: {
        disconnect: async () =>
          new Promise<void>((resolve) => {
            finishEvmDisconnect = resolve;
          }),
      },
      solana: {},
    });
    const { result } = renderWallets({
      providers: [wallet],
      allBlockChains,
      emitter,
    });

    await act(async () => {
      await result.current.connect('disconnect-wallet', [
        { namespace: 'EVM', network: undefined },
        { namespace: 'Solana', network: undefined },
      ]);
    });
    events.length = 0;

    await act(async () => {
      await result.current.disconnect('disconnect-wallet');
    });

    // Both events fire before the pending EVM disconnect settles.
    expect(events).toEqual([
      {
        type: WalletEventTypes.WALLET_DISCONNECTED,
        payload: { walletName: 'disconnect-wallet', namespace: 'EVM' },
      },
      {
        type: WalletEventTypes.WALLET_DISCONNECTED,
        payload: { walletName: 'disconnect-wallet', namespace: 'Solana' },
      },
    ]);

    await act(async () => {
      finishEvmDisconnect();
    });

    expect(events).toHaveLength(2);
  });
});

describe('auto-connect', () => {
  function saveLastConnectedWallet(walletId: string) {
    localStorage.setItem(
      LAST_CONNECTED_WALLETS_KEY,
      JSON.stringify({
        [walletId]: savedNamespaces,
      })
    );
  }

  const savedNamespaces = [
    { namespace: 'EVM', network: 'ETH' },
    { namespace: 'Solana' },
  ];

  // Resolves once every saved namespace has an outcome (connected or failed).
  async function runAutoConnect(
    walletId: string,
    namespaces: { evm: NamespaceBehaviour; solana: NamespaceBehaviour }
  ) {
    const { events, emitter } = createRecordingEmitter();
    saveLastConnectedWallet(walletId);
    renderWallets({
      providers: [buildWallet(walletId, namespaces)],
      allBlockChains,
      autoConnect: true,
      emitter,
    });

    await vi.waitFor(() =>
      expect(
        withoutDetection(events).filter(
          (event) => event.type !== WalletEventTypes.WALLET_CONNECT_INITIATED
        )
      ).toHaveLength(savedNamespaces.length)
    );
    const connectEvents = withoutDetection(events);

    expect(connectEvents[0].type).toBe(
      WalletEventTypes.WALLET_CONNECT_INITIATED
    );
    connectEvents.forEach((event) => {
      expect(event.payload).toMatchObject({
        walletName: walletId,
        origin: 'auto',
      });
    });
    return connectEvents.map((event) => [
      event.type,
      'namespace' in event.payload && event.payload.namespace,
      'chain' in event.payload && event.payload.chain,
    ]);
  }

  test('reports a namespace whose eager-connect check returns false as failed', async () => {
    const events = await runAutoConnect('auto-check-false', {
      evm: {},
      solana: { canEagerConnect: async () => false },
    });

    expect(events).toEqual([
      [WalletEventTypes.WALLET_CONNECT_INITIATED, 'EVM', 'ETH'],
      [WalletEventTypes.WALLET_CONNECT_INITIATED, 'Solana', null],
      [WalletEventTypes.WALLET_CONNECT_FAILED, 'Solana', null],
      [WalletEventTypes.WALLET_CONNECTED, 'EVM', 'ETH'],
    ]);
  });

  test('reports a namespace whose eager-connect check throws as failed', async () => {
    const events = await runAutoConnect('auto-check-throws', {
      evm: { canEagerConnect: rejectWith(new Error('check failed')) },
      solana: {},
    });

    expect(events).toEqual([
      [WalletEventTypes.WALLET_CONNECT_INITIATED, 'EVM', 'ETH'],
      [WalletEventTypes.WALLET_CONNECT_INITIATED, 'Solana', null],
      [WalletEventTypes.WALLET_CONNECT_FAILED, 'EVM', 'ETH'],
      [WalletEventTypes.WALLET_CONNECTED, 'Solana', null],
    ]);
  });

  test('reports a connect that fails after the check passed', async () => {
    const consoleWarn = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const events = await runAutoConnect('auto-connect-fails', {
      evm: { connect: rejectWith(new Error('connect failed')) },
      solana: { connect: rejectWith(new Error('connect failed')) },
    });

    expect(events).toEqual([
      [WalletEventTypes.WALLET_CONNECT_INITIATED, 'EVM', 'ETH'],
      [WalletEventTypes.WALLET_CONNECT_INITIATED, 'Solana', null],
      [WalletEventTypes.WALLET_CONNECT_FAILED, 'EVM', 'ETH'],
      [WalletEventTypes.WALLET_CONNECT_FAILED, 'Solana', null],
    ]);
    consoleWarn.mockRestore();
  });

  test('reports connected namespaces', async () => {
    const events = await runAutoConnect('auto-success', {
      evm: {},
      solana: {},
    });

    expect(events).toEqual([
      [WalletEventTypes.WALLET_CONNECT_INITIATED, 'EVM', 'ETH'],
      [WalletEventTypes.WALLET_CONNECT_INITIATED, 'Solana', null],
      [WalletEventTypes.WALLET_CONNECTED, 'EVM', 'ETH'],
      [WalletEventTypes.WALLET_CONNECTED, 'Solana', null],
    ]);
  });
});

describe('detection', () => {
  function detectedWalletNames(events: WalletEventData[]) {
    return events
      .filter((event) => event.type === WalletEventTypes.WALLET_DETECTED)
      .map((event) => event.payload.walletName);
  }

  test('emits a detected wallet once per page session', () => {
    const first = createRecordingEmitter();
    renderWallets({
      providers: [buildWallet('detected-once')],
      allBlockChains,
      emitter: first.emitter,
    });

    const second = createRecordingEmitter();
    renderWallets({
      providers: [buildWallet('detected-once')],
      allBlockChains,
      emitter: second.emitter,
    });

    expect(detectedWalletNames(first.events)).toEqual(['detected-once']);
    expect(detectedWalletNames(second.events)).toEqual([]);
  });

  test('skips wallets that always report themselves installed', () => {
    const { events, emitter } = createRecordingEmitter();
    renderWallets({
      providers: [buildWallet('ledger'), buildWallet('detected-regular')],
      allBlockChains,
      emitter,
    });

    expect(detectedWalletNames(events)).toEqual(['detected-regular']);
  });

  test('emits nothing for a wallet that is not installed', () => {
    const { events, emitter } = createRecordingEmitter();
    renderWallets({
      providers: [
        buildWallet('detected-not-installed', {}, { installed: false }),
      ],
      allBlockChains,
      emitter,
    });

    expect(detectedWalletNames(events)).toEqual([]);
  });
});
