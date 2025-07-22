import { legacyProviderImportsToVersionsInterface } from '@arlert-dev/wallets-core/utils';
import { renderHook } from '@testing-library/react-hooks';
import { TransactionType } from 'rango-types';
import React from 'react';
import { describe, expect, test, vi } from 'vitest';

import { Provider, useWallets } from '../src/index.js';
import {
  blockchainsMeta,
  legacyAddress,
  legacyProvider,
} from '../src/test-utils/fixtures.js';

describe('check legacy is working correctly', () => {
  test("initialize legacy provider and it's accessible", async () => {
    const wrapper = ({ children }: any) => {
      const list = [legacyProviderImportsToVersionsInterface(legacyProvider)];

      return <Provider providers={list}>{children}</Provider>;
    };

    const { result } = renderHook(() => useWallets(), {
      wrapper,
    });

    // providers are evaluated lazily, so before calling `connect` its value is `null`
    expect(result.current.providers()['legacy-garbage']).toBe(null);

    // while try to connect, `provider` will be initialized.
    await result.current.connect('legacy-garbage');
    expect(result.current.providers()['legacy-garbage']).toStrictEqual(
      legacyProvider.getInstance()
    );
  });

  test.todo('check allBlockchains works correctly', () => {
    //
  });

  test.todo('check onUpdateState works correctly', () => {
    //
  });

  test.todo('change props value after initializing', () => {
    //
  });
});

describe('check legacy connect method is working', () => {
  test('throw an error if trying to connect to an undefined wallet', async () => {
    const wrapper = ({ children }: any) => {
      const list = [legacyProviderImportsToVersionsInterface(legacyProvider)];

      return <Provider providers={list}>{children}</Provider>;
    };

    const { result } = renderHook(() => useWallets(), {
      wrapper,
    });

    await expect(result.current.connect('whatever')).rejects.toThrow(
      'You should add'
    );
  });

  test('will be ignored and use first namespace when passing multiple namespaces', async () => {
    const wrapper = ({ children }: any) => {
      const list = [legacyProviderImportsToVersionsInterface(legacyProvider)];

      return <Provider providers={list}>{children}</Provider>;
    };

    const { result } = renderHook(() => useWallets(), {
      wrapper,
    });

    const connectResult = await result.current.connect('legacy-garbage', [
      {
        namespace: 'EVM',
        network: 'eth',
      },
      {
        namespace: 'EVM',
        network: 'arb',
      },
    ]);

    expect(connectResult).toHaveLength(1);
    expect(connectResult[0].network).toBe('eth');
  });
  test('update internal states correctly', async () => {
    const wrapper = ({ children }: any) => {
      const list = [legacyProviderImportsToVersionsInterface(legacyProvider)];

      return (
        <Provider providers={list} allBlockChains={blockchainsMeta}>
          {children}
        </Provider>
      );
    };

    const { result } = renderHook(() => useWallets(), {
      wrapper,
    });

    const initialState = {
      installed: true,
      connecting: false,
      connected: false,
      accounts: null,
      network: null,
    };
    expect(result.current.state('legacy-garbage')).toMatchObject(initialState);

    // connecting successfully.
    await result.current.connect('legacy-garbage', [
      { namespace: 'EVM', network: 'ETH' },
    ]);

    expect(result.current.state('legacy-garbage')).toMatchObject({
      installed: true,
      connecting: false,
      connected: true,
      accounts: [`ETH:${legacyAddress}`],
      network: 'ETH',
    });

    // unsuccessful connection
    await expect(
      result.current.connect('legacy-garbage', [
        { namespace: 'EVM', network: 'When Airdrop?' },
      ])
    ).rejects.toThrowError();
    // state should be reset
    expect(result.current.state('legacy-garbage')).toMatchObject(initialState);
  });

  test.todo("throw error when it's already on connecting", async () => {
    //
  });

  test.todo('ensure extra context added to `connect` function', async () => {
    // make sure correct values passed to `provider connect fn`: { instance, network, meta, namespaces}
  });

  test.todo(
    'return multiple result from connect should handle network and accounts correctly ',
    async () => {
      // if connect fn returns array, it has own logic.
    }
  );

  test.todo('return empty result from connect', async () => {
    // if connect fn return empty array, state shouldn't be updated.
  });

  test.todo('suggestAndConnect', async () => {
    //
  });
});

describe('check legacy switching network', () => {
  test('switch network & canSwitchNetworkTo', async () => {
    const switchNetwork = vi.fn();

    const wrapper = ({ children }: any) => {
      const extendLegacyProvider = { ...legacyProvider };
      extendLegacyProvider.canSwitchNetworkTo = ({ meta, network }) => {
        return !!meta.find((blockchain) => blockchain.name === network);
      };
      extendLegacyProvider.getWalletInfo = (allBlockChains) => {
        const base = legacyProvider.getWalletInfo(allBlockChains);
        return {
          ...base,
          supportedChains: blockchainsMeta,
        };
      };
      extendLegacyProvider.switchNetwork = async () => {
        switchNetwork();
      };

      const list = [
        legacyProviderImportsToVersionsInterface(extendLegacyProvider),
      ];

      return (
        <Provider providers={list} allBlockChains={blockchainsMeta}>
          {children}
        </Provider>
      );
    };

    const { result } = renderHook(() => useWallets(), {
      wrapper,
    });

    // First we should connect to any network
    await result.current.connect('legacy-garbage', [
      {
        namespace: 'EVM',
        network: 'ETH',
      },
    ]);

    expect(result.current.state('legacy-garbage')).toMatchObject({
      network: 'ETH',
    });

    expect(result.current.canSwitchNetworkTo('legacy-garbage', 'COSMOS')).toBe(
      true
    );
    expect(
      result.current.canSwitchNetworkTo('legacy-garbage', 'whatever')
    ).toBe(false);

    // Then passing a different network name, will trigger switch network.
    await result.current.connect('legacy-garbage', [
      {
        namespace: 'EVM',
        network: 'COSMOS',
      },
    ]);

    expect(switchNetwork).toBeCalledTimes(1);

    expect(result.current.state('legacy-garbage')).toMatchObject({
      network: 'COSMOS',
    });
  });
});

describe('check functionality related to connect', () => {
  test.todo('disconnect & disconnectAll', async () => {
    //
  });

  test.todo('autoConnect', async () => {
    // connect method has an `if` for persisting wallet, check that as well.
  });
});

describe('check signers', () => {
  test('should signers be accessible', async () => {
    const wrapper = ({ children }: any) => {
      const list = [legacyProviderImportsToVersionsInterface(legacyProvider)];

      return <Provider providers={list}>{children}</Provider>;
    };

    const { result } = renderHook(() => useWallets(), {
      wrapper,
    });

    const signers = await result.current.getSigners('legacy-garbage');
    expect(
      await signers.getSigner(TransactionType.EVM).signMessage('', '', null)
    ).toBeTypeOf('string');
    expect(() => signers.getSigner(TransactionType.SOLANA)).toThrowError();
  });
});
