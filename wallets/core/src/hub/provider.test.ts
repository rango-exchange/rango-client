import type { EvmActions } from '../actions/evm/interface';

import { beforeEach, describe, expect, test } from 'vitest';

import { BlockchainProvider } from './blockchain';
import { Provider } from './provider';

describe('providers', () => {
  let blockchainProviders: BlockchainProvider<EvmActions>[] = [];

  beforeEach(() => {
    const someBlockchain = new BlockchainProvider<EvmActions>();
    const anotherBlockchain = new BlockchainProvider<EvmActions>();

    blockchainProviders = [someBlockchain, anotherBlockchain];

    return () => {
      blockchainProviders = [];
    };
  });

  test('Initialize providers correctly', () => {
    const wallet = new Provider('rangomask');
    const [blockchain1, blockchain2] = blockchainProviders;
    wallet.add('evm', blockchain1.build()).add('solana', blockchain2.build());

    const allProviders = wallet.getAll();
    expect(allProviders.size).toBe(2);
  });

  test('updating states', () => {
    const wallet = new Provider('rangomask');
    const [blockchain1, blockchain2] = blockchainProviders;
    wallet.add('evm', blockchain1.build()).add('solana', blockchain2.build());

    const [getState, setState] = wallet.state();
    setState('connected', true);
    const isConnected = getState('connected');
    expect(isConnected).toBe(true);

    // TODO: state values should have validation
  });

  test('run actions', () => {
    const wallet = new Provider('rangomask');
    const [blockchain1, blockchain2] = blockchainProviders;
    blockchain2.action('connect', () => 'hello world');
    wallet.add('evm', blockchain1.build()).add('solana', blockchain2.build());

    expect(blockchain2.run('connect')).toBe('hello world');
    expect(() => blockchain1.run('connect')).toThrowError();
  });
});
