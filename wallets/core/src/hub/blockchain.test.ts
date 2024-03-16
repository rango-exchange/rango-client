import { describe, expect, test } from 'vitest';

import { BlockchainProvider } from './blockchain';

describe('blockchain construction', () => {
  test('add actions and run them.', () => {
    const blockchain = new BlockchainProvider<any>();
    blockchain.action('hello', () => 'hello world');
    blockchain.action('bye', () => 'bye bye');
    blockchain
      .action('chainable', () => "it's also chainable")
      .action('chain2', () => 'chain2');

    expect(blockchain.run('hello')).toBe('hello world');
    expect(blockchain.run('bye')).toBe('bye bye');

    expect(() => blockchain.run('not-added-action')).toThrowError();
  });

  test('subscribers should be added and removed correctly', () => {
    const blockchain = new BlockchainProvider<any>();
    blockchain.subscriber(() => {
      // noop
      return () => {
        // noop
      };
    });
    expect(blockchain.countSubscribers()).toBe(1);
    blockchain.cleanUp();
    expect(blockchain.countSubscribers()).toBe(0);
  });
});
