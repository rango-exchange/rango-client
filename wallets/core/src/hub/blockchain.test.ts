import { describe, expect, test, vi } from 'vitest';

import { BlockchainProviderBuilder } from './blockchain';

describe('check BlockchainProviderBuilder works as expected', () => {
  const NAMESPACE = 'bip122';

  test('add actions and run them.', () => {
    const builder = new BlockchainProviderBuilder<{
      hello: () => void;
      bye: () => void;
      chainable: () => void;
      chain2: () => void;
    }>();
    builder.config('namespace', NAMESPACE);
    builder.action('hello', () => 'hello world');
    builder.action('bye', () => 'bye bye');
    builder
      .action('chainable', () => "it's also chainable")
      .action('chain2', () => 'chain2');
    const blockchain = builder.build();

    expect(blockchain.hello()).toBe('hello world');
    expect(blockchain.bye()).toBe('bye bye');

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      return blockchain.some_action_name_that_has_not_added();
    }).toThrowError();
  });

  test('subscribers should be added and removed correctly', () => {
    const builder = new BlockchainProviderBuilder<{
      //
    }>();
    builder.config('namespace', NAMESPACE);
    const cleanUpCb = vi.fn();
    const subscriberCb = vi.fn(() => {
      return cleanUpCb;
    });
    builder.subscriber(subscriberCb);
    const blockchain = builder.build();

    expect(subscriberCb).toBeCalledTimes(0);
    expect(cleanUpCb).toBeCalledTimes(0);
    blockchain.init();
    expect(subscriberCb).toBeCalledTimes(1);
    expect(cleanUpCb).toBeCalledTimes(0);
    blockchain.destroy();
    expect(subscriberCb).toBeCalledTimes(1);
    expect(cleanUpCb).toBeCalledTimes(1);
  });

  test('call .init only once.', () => {
    const builder = new BlockchainProviderBuilder<any>();
    builder.config('namespace', NAMESPACE);
    let count = 0;
    builder.action('init', () => {
      count++;
    });
    const blockchain = builder.build();
    blockchain.init();
    blockchain.init();

    expect(count).toBe(1);
  });
});
