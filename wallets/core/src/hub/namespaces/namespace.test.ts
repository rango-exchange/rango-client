import { describe, expect, test, vi } from 'vitest';

import { createStore } from '../mod.js';

import { OR_ELSE_ACTION_FAILED_ERROR } from './errors.js';
import { Namespace } from './namespace.js';

interface CustomMatchers<R = unknown> {
  toThrowErrorWithCause: (expectedError: unknown, expectedCause: unknown) => R;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
  interface Assertion<T = any> extends CustomMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

interface TestNamespaceActions {
  connect: () => void;
  disconnect: () => void;
}

expect.extend({
  toThrowErrorWithCause(actualFunction, expectedError, expectedCause) {
    try {
      actualFunction();
    } catch (error) {
      const isExactError = error === expectedError;
      const hasExpectedCause =
        error instanceof Error && error.cause === expectedCause;

      if (isExactError) {
        return {
          pass: true,
          message: () => `Expected function to throw the exact error.`,
        };
      }

      if (hasExpectedCause) {
        return {
          pass: true,
          message: () =>
            `Expected function to throw an error with the exact cause.`,
        };
      }

      return {
        pass: false,
        message: () =>
          `Expected function to throw the exact error with the expected cause, but got a different error.`,
      };
    }

    return {
      pass: false,
      message: () =>
        `Expected function to throw an Error, but it did not throw.`,
    };
  },
});

describe('check initializing Namespace', () => {
  const NAMESPACE = 'evm';
  const PROVIDER_ID = 'garbage provider';

  test('initialize a namespace and run an action', () => {
    const connect = vi.fn();
    const disconnect = vi.fn();
    const actions = new Map();
    actions.set('connect', connect);
    actions.set('disconnect', disconnect);

    const ns = new Namespace<TestNamespaceActions>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
    });

    ns.run('connect');

    expect(disconnect).toBeCalledTimes(0);
    expect(connect).toBeCalledTimes(1);
  });

  test('init action should be called once', () => {
    const connect = vi.fn();
    const disconnect = vi.fn();
    const init = vi.fn();
    const actions = new Map();
    actions.set('connect', connect);
    actions.set('disconnect', disconnect);
    actions.set('init', init);

    const ns = new Namespace<TestNamespaceActions>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
    });

    expect(init).toBeCalledTimes(0);

    ns.run('connect');
    ns.init();
    ns.init();

    expect(disconnect).toBeCalledTimes(0);
    expect(connect).toBeCalledTimes(1);
    expect(init).toBeCalledTimes(1);
  });

  test('state should be updated and actions have access to them', () => {
    const connect = vi.fn((context) => {
      const [, setState] = context.state();
      setState('connected', true);
    });
    const init = vi.fn((context) => {
      const [, setState] = context.state();
      setState('connecting', true);
    });
    const actions = new Map();
    actions.set('connect', connect);
    actions.set('init', init);

    const store = createStore();
    const ns = new Namespace<TestNamespaceActions>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
      store,
    });

    ns.run('connect');
    ns.init();
    ns.init();

    const [currentState] = ns.state();
    expect(currentState().connected).toBe(true);
    expect(currentState('connecting')).toBe(true);
  });

  test("throw an error if store doesn't set", () => {
    const ns = new Namespace<TestNamespaceActions>(NAMESPACE, PROVIDER_ID, {
      actions: new Map(),
    });

    expect(() => ns.state()).toThrowError();
  });
});

describe('check actions with hooks and operators', () => {
  const NAMESPACE = 'bip122';
  const PROVIDER_ID = 'garbage provider';

  test('add actions and run them.', () => {
    const actions = new Map();
    actions.set('hello', () => 'hello world');
    actions.set('bye', () => 'bye bye');
    actions.set('chainable', () => "it's also chainable");
    actions.set('chain2', () => "it's also chainable");

    const ns = new Namespace<{
      hello: () => string;
      bye: () => string;
      chainable: () => void;
      chain2: () => void;
    }>(NAMESPACE, PROVIDER_ID, { actions });

    expect(ns.run('hello')).toBe('hello world');
    expect(ns.run('bye')).toBe('bye bye');

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      return ns.run('some_action_name_that_has_not_added');
    }).toThrowError();
  });

  test('should be called before/after target action correctly even with multiple hook assigned to an action name', () => {
    const beforeAction = vi.fn();
    const anotherBeforeAction = vi.fn();
    const afterAction = vi.fn();
    const anotherAfterAction = vi.fn();
    const connectAction = vi.fn();
    const disconnectAction = vi.fn();

    const actions = new Map();
    actions.set('connect', connectAction);
    actions.set('disconnect', disconnectAction);

    const ns = new Namespace<TestNamespaceActions>(NAMESPACE, PROVIDER_ID, {
      actions,
    });

    ns.run('connect');
    expect(connectAction).toBeCalledTimes(1);
    expect(beforeAction).toBeCalledTimes(0);
    expect(anotherBeforeAction).toBeCalledTimes(0);
    expect(afterAction).toBeCalledTimes(0);
    expect(anotherAfterAction).toBeCalledTimes(0);

    ns.before('connect', beforeAction);
    ns.before('connect', anotherBeforeAction);
    ns.run('connect');
    expect(connectAction).toBeCalledTimes(2);
    expect(beforeAction).toBeCalledTimes(1);
    expect(anotherBeforeAction).toBeCalledTimes(1);
    expect(afterAction).toBeCalledTimes(0);
    expect(anotherAfterAction).toBeCalledTimes(0);

    ns.after('connect', afterAction);
    ns.after('connect', anotherAfterAction);
    ns.run('connect');
    expect(beforeAction).toBeCalledTimes(2);
    expect(anotherBeforeAction).toBeCalledTimes(2);
    expect(afterAction).toBeCalledTimes(1);
    expect(anotherAfterAction).toBeCalledTimes(1);
  });

  test('should call `and_then` sequentially.', () => {
    const andActionFirst = vi.fn((_ctx, result) => result + 1);
    const andActionSecond = vi.fn((_ctx, result) => result + 1);

    const connectAction = vi.fn(() => 0);
    const disconnectAction = vi.fn();

    const actions = new Map();
    actions.set('connect', connectAction);
    actions.set('disconnect', disconnectAction);

    const ns = new Namespace<TestNamespaceActions>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
    });
    ns.and_then('connect', andActionFirst);
    ns.and_then('connect', andActionSecond);

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

  test("shouldn't run other `and_then` hooks if one of them fails then fallback to `or_else`.", () => {
    const andActionFirst = vi.fn((_ctx, _result) => {
      throw new Error('Oops!');
    });
    const andActionSecond = vi.fn((_ctx, result) => result + 1);

    const orAction = vi.fn((_ctx, e) => e instanceof Error);

    const connectAction = vi.fn(() => 0);
    const actions = new Map();
    actions.set('connect', connectAction);

    const ns = new Namespace<{
      connect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
      configs: {},
    });
    ns.and_then('connect', andActionFirst);
    ns.and_then('connect', andActionSecond);

    ns.or_else('connect', orAction);

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

    const connectAction = vi.fn(() => 0);
    const actions = new Map();
    actions.set('connect', connectAction);

    const ns = new Namespace<{
      connect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
      configs: {},
    });

    ns.and_then('connect', andActionFirst);
    ns.and_then('connect', andActionSecond);

    expect(() => ns.run('connect')).toThrowError();
  });

  test('ensure `or_else` has access to error', () => {
    const actions = new Map();
    actions.set('connect', () => {
      throw new Error('Oops!');
    });

    const ns = new Namespace<{
      connect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
      configs: {},
    });

    ns.or_else('connect', (_ctx: unknown, err: unknown) => {
      return err instanceof Error;
    });

    const result = ns.run('connect');
    expect(result).toBe(true);
  });

  test('should call `or_else` sequentially.', () => {
    const orActionFirst = vi.fn((_ctx, _err) => 1);
    const orActionSecond = vi.fn((_ctx, _err) => _err + 1);

    const connectAction = vi.fn(() => {
      throw new Error('Oops!');
    });

    const actions = new Map();
    actions.set('connect', connectAction);

    const ns = new Namespace<{
      connect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
    });

    ns.or_else('connect', orActionFirst);
    ns.or_else('connect', orActionSecond);

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
  test('throw a wrapped error if `or_else` handler fails to run.', () => {
    const orActionFirst = vi.fn((_ctx, _err) => 1);
    const orActionSecondError = 'This is actually a bad situation';
    const orActionSecond = vi.fn((_ctx, _err) => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw orActionSecondError;
    });
    const connectActionError = new Error('Oops!');

    const connectAction = vi.fn(() => {
      throw connectActionError;
    });

    const actions = new Map();
    actions.set('connect', connectAction);

    const ns = new Namespace<{
      connect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
    });

    ns.or_else('connect', orActionFirst);
    ns.or_else('connect', orActionSecond);

    expect(() => ns.run('connect')).toThrowError(
      expect.objectContaining({
        message: OR_ELSE_ACTION_FAILED_ERROR(
          `connect for ${ns.namespaceId} namespace.`
        ),
        cause: expect.objectContaining({
          message: orActionSecondError,
          cause: connectActionError,
        }),
      })
    );

    expect(orActionFirst).toBeCalledTimes(1);
    expect(connectAction).toBeCalledTimes(1);
    expect(orActionSecond).toBeCalledTimes(1);
  });

  test('throw the exact error if `or_else` handler fails and the error is an instance of Error.', () => {
    const orActionError = new Error('Or action error');
    const orAction = vi.fn((_ctx, _err) => {
      throw orActionError;
    });
    const connectActionError = new Error('Oops!');
    const connectAction = vi.fn(() => {
      throw connectActionError;
    });
    const actions = new Map();
    actions.set('connect', connectAction);

    const ns = new Namespace<{
      connect: () => void;
    }>(NAMESPACE, PROVIDER_ID, {
      actions: actions,
    });
    ns.or_else('connect', orAction);

    expect(() => {
      ns.run('connect');
    }).toThrowErrorWithCause(orActionError, connectActionError);

    expect(orAction).toBeCalledTimes(1);
    expect(connectAction).toBeCalledTimes(1);
  });
});
