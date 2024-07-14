import { describe, expect, test, vi } from 'vitest';

import { NamespaceBuilder } from '../../builders/mod.js';

import { Namespace } from './namespace.js';

describe('check NamespaceBuilder works as expected', () => {
  const NAMESPACE = 'bip122';
  const PROVIDER_ID = 'garbage provider';

  test.todo('ensure namespace without any hooks running correctly');

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

  test('should call `and` sequentially.', () => {
    const andActionFirst = vi.fn((_ctx, result) => result + 1);
    const andActionSecond = vi.fn((_ctx, result) => result + 1);

    const connectAction = vi.fn(() => 0);
    const disconnectAction = vi.fn();

    const andActions = new Map();
    andActions.set('connect', [andActionFirst, andActionSecond]);

    const actions = new Map();
    actions.set('connect', connectAction);
    actions.set('disconnect', disconnectAction);

    const ns = new Namespace<{
      connect: () => void;
      disconnect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
      andUse: andActions,
      orUse: new Map(),
      afterUse: new Map(),
      beforeUse: new Map(),
      configs: {},
    });

    const result = ns.run('connect');

    expect(connectAction).toBeCalledTimes(1);
    expect(andActionFirst).toBeCalledTimes(1);
    expect(andActionSecond).toBeCalledTimes(1);

    expect(result).toBe(2);

    ns.run('connect');
    expect(connectAction).toBeCalledTimes(2);
    expect(andActionFirst).toBeCalledTimes(2);
    expect(andActionSecond).toBeCalledTimes(2);
  });

  test("shouldn't run other `and` hooks if one of them fails then fallback to `or`.", () => {
    const andActionFirst = vi.fn((_ctx, _result) => {
      throw new Error('Oops!');
    });
    const andActionSecond = vi.fn((_ctx, result) => result + 1);
    const andActions = new Map();
    andActions.set('connect', [andActionFirst, andActionSecond]);

    const orAction = vi.fn((_ctx, e) => e instanceof Error);
    const orActions = new Map();
    orActions.set('connect', [orAction]);

    const connectAction = vi.fn(() => 0);
    const actions = new Map();
    actions.set('connect', connectAction);

    const ns = new Namespace<{
      connect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
      andUse: andActions,
      orUse: orActions,
      afterUse: new Map(),
      beforeUse: new Map(),
      configs: {},
    });

    const result = ns.run('connect');

    expect(connectAction).toBeCalledTimes(1);
    expect(andActionFirst).toBeCalledTimes(1);
    expect(andActionSecond).toBeCalledTimes(0);
    expect(orAction).toBeCalledTimes(1);
    expect(result).toBe(true);
  });

  test('should throw error if there are no `or` to handle error', () => {
    const andActionFirst = vi.fn((_ctx, _result) => {
      throw new Error('Oops!');
    });
    const andActionSecond = vi.fn((_ctx, result) => result + 1);
    const andActions = new Map();
    andActions.set('connect', [andActionFirst, andActionSecond]);

    const connectAction = vi.fn(() => 0);
    const actions = new Map();
    actions.set('connect', connectAction);

    const ns = new Namespace<{
      connect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
      andUse: andActions,
      orUse: new Map(),
      afterUse: new Map(),
      beforeUse: new Map(),
      configs: {},
    });

    expect(() => ns.run('connect')).toThrowError();
  });

  test('ensure `or` has access to error', () => {
    const orActions = new Map();
    orActions.set('connect', [
      (_ctx: any, err: any) => {
        return err instanceof Error;
      },
    ]);

    const actions = new Map();
    actions.set('connect', () => {
      throw new Error('Oops!');
    });

    const ns = new Namespace<{
      connect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
      andUse: new Map(),
      orUse: orActions,
      afterUse: new Map(),
      beforeUse: new Map(),
      configs: {},
    });

    const result = ns.run('connect');
    expect(result).toBe(true);
  });

  test('should call `or` sequentially.', () => {
    const orActionFirst = vi.fn((_ctx, _err) => 1);
    const orActionSecond = vi.fn((_ctx, _err) => _err + 1);

    const connectAction = vi.fn(() => {
      throw new Error('Oops!');
    });

    const orActions = new Map();
    orActions.set('connect', [orActionFirst, orActionSecond]);

    const actions = new Map();
    actions.set('connect', connectAction);

    const ns = new Namespace<{
      connect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
      andUse: new Map(),
      orUse: orActions,
      afterUse: new Map(),
      beforeUse: new Map(),
      configs: {},
    });

    const result = ns.run('connect');

    expect(connectAction).toBeCalledTimes(1);
    expect(orActionFirst).toBeCalledTimes(1);
    expect(orActionSecond).toBeCalledTimes(1);

    expect(result).toBe(2);

    ns.run('connect');
    expect(connectAction).toBeCalledTimes(2);
    expect(orActionFirst).toBeCalledTimes(2);
    expect(orActionSecond).toBeCalledTimes(2);
  });
});
