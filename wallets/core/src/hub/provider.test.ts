import { beforeEach, describe, expect, test } from 'vitest';

import { BlockchainProvider } from './blockchain';
import { Provider } from './provider';

describe('providers', () => {
  let blockchainProviders: BlockchainProvider[] = [];

  beforeEach(() => {
    const someBlockchain = new BlockchainProvider({
      id: 'eth-provider',
    });
    const anotherBlockchain = new BlockchainProvider({
      id: 'pol-blockchain',
    });

    blockchainProviders = [someBlockchain, anotherBlockchain];

    return () => {
      blockchainProviders = [];
    };
  });

  test('Initialize providers correctly', () => {
    const wallet = new Provider('rangomask');
    const [blockchain1, blockchain2] = blockchainProviders;
    wallet.add(blockchain1).add(blockchain2);

    const allProviders = wallet.getAll();
    expect(allProviders.size).toBe(2);
  });

  test('updating states', () => {
    const wallet = new Provider('rangomask');
    const [blockchain1, blockchain2] = blockchainProviders;
    wallet.add(blockchain1).add(blockchain2);

    const [getState, setState] = wallet.state();
    setState('connected', true);
    const isConnected = getState('connected');
    expect(isConnected).toBe(true);

    // TODO: state values should have validation
  });

  test('run actions', () => {
    const wallet = new Provider('rangomask');
    const [blockchain1, blockchain2] = blockchainProviders;
    blockchain2.action('hello', () => 'hello world');
    wallet.add(blockchain1).add(blockchain2);

    expect(blockchain2.run('hello')).toBe('hello world');
    expect(() => blockchain1.run('hello')).toThrowError();
  });
});
