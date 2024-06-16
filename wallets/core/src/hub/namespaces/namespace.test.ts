import { describe, expect, test, vi } from 'vitest';

import { NamespaceBuilder } from '../../builders/namespace.js';

describe('check NamespaceBuilder works as expected', () => {
  const NAMESPACE = 'bip122';
  const PROVIDER_ID = 'garbage provider';

  test('add actions and run them.', () => {
    const builder = new NamespaceBuilder<{
      hello: () => void;
      bye: () => void;
      chainable: () => void;
      chain2: () => void;
    }>(NAMESPACE, PROVIDER_ID);
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

  test('call .init only once.', () => {
    const builder = new NamespaceBuilder<any>(NAMESPACE, PROVIDER_ID);
    let count = 0;
    builder.action('init', () => {
      count++;
    });
    const blockchain = builder.build();
    blockchain.init();
    blockchain.init();

    expect(count).toBe(1);
  });

  test('should be called before/after target action correctly even with multiple hook assigned to an action name', () => {
    const beforeAction = vi.fn();
    const anotherBeforeAction = vi.fn();
    const afterAction = vi.fn();
    const anotherAfterAction = vi.fn();
    const connectAction = vi.fn();
    const disconnectAction = vi.fn();
    const builder = new NamespaceBuilder<{
      connect: () => void;
      disconnect: () => void;
    }>(NAMESPACE, PROVIDER_ID);
    builder.action('connect', connectAction);
    builder.action('disconnect', disconnectAction);
    const blockchain = builder.build();

    blockchain.connect();
    expect(connectAction).toBeCalledTimes(1);
    expect(beforeAction).toBeCalledTimes(0);
    expect(anotherBeforeAction).toBeCalledTimes(0);
    expect(afterAction).toBeCalledTimes(0);
    expect(anotherAfterAction).toBeCalledTimes(0);

    blockchain.before('connect', beforeAction);
    blockchain.before('connect', anotherBeforeAction);
    blockchain.connect();
    expect(connectAction).toBeCalledTimes(2);
    expect(beforeAction).toBeCalledTimes(1);
    expect(anotherBeforeAction).toBeCalledTimes(1);
    expect(afterAction).toBeCalledTimes(0);
    expect(anotherAfterAction).toBeCalledTimes(0);

    blockchain.after('connect', afterAction);
    blockchain.after('connect', anotherAfterAction);
    blockchain.connect();
    expect(beforeAction).toBeCalledTimes(2);
    expect(anotherBeforeAction).toBeCalledTimes(2);
    expect(afterAction).toBeCalledTimes(1);
    expect(anotherAfterAction).toBeCalledTimes(1);
  });
});
