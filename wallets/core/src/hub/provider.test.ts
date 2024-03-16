import type { EvmActions } from '../actions/evm/interface';
import type { SolanaActions } from '../actions/solana/interface';

import { beforeEach, describe, expect, test } from 'vitest';

import { BlockchainProvider } from './blockchain';
import { ProviderBuilder } from './provider';

describe('providers', () => {
  let blockchainProviders: {
    evm: BlockchainProvider<EvmActions>;
    solana: BlockchainProvider<SolanaActions>;
  };

  beforeEach(() => {
    const evmBlockchain = new BlockchainProvider<EvmActions>();
    const solanaBlockchain = new BlockchainProvider<SolanaActions>();

    blockchainProviders = {
      evm: evmBlockchain,
      solana: solanaBlockchain,
    };

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      blockchainProviders = undefined;
    };
  });

  test('Initialize providers correctly', () => {
    const builder = new ProviderBuilder('garbage');
    const { evm, solana } = blockchainProviders;
    builder.add('evm', evm.build()).add('solana', solana.build());
    const wallet = builder.build();

    const allProviders = wallet.getAll();
    expect(allProviders.size).toBe(2);
  });

  test('updating states', () => {
    const builder = new ProviderBuilder('garbage');
    const { evm, solana } = blockchainProviders;
    builder.add('evm', evm.build()).add('solana', solana.build());

    const wallet = builder.build();
    const [getState, setState] = wallet.state();
    setState('connected', true);
    const isConnected = getState('connected');
    expect(isConnected).toBe(true);
  });

  test('run actions', () => {
    const builder = new ProviderBuilder('garbage');
    const { evm, solana } = blockchainProviders;
    solana.action('connect', () => [
      '0x000000000000000000000000000000000000dead',
    ]);
    builder.add('evm', evm.build()).add('solana', solana.build());

    const wallet = builder.build();

    expect(wallet.get('solana').connect()).toStrictEqual([
      '0x000000000000000000000000000000000000dead',
    ]);
    // Since we didn't add any action regarding connect for `evm`
    expect(() => wallet.get('evm').connect('0x1')).toThrowError();
  });

  test('sets config properly', () => {
    const sample = {
      name: 'Garbage Wallet',
      icon: 'https://somewhereininternet.com/icon.svg',
      extensions: {
        homepage: 'https://app.rango.exchange',
      },
    };
    const builder = new ProviderBuilder('garbage');
    builder.config('info', sample);
    const wallet = builder.build();

    expect(wallet.info()).toStrictEqual(sample);
  });
});
