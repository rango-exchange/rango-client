import type { Actions } from '../../../hub/namespaces/types.js';
import type { AutoImplementedActionsByRecommended } from '../types.js';

import { waitFor } from '@testing-library/dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { createStore, Namespace } from '../../../mod.js';

import { ChangeAccountSubscriberBuilder } from './changeAccountSubscriber.js';

interface TestNamespaceActions {
  disconnect: () => void;
}

describe('check changeAccountSubscriber', () => {
  const garbageProvider = { name: 'garbage provider' };

  const garbageFormatter = async (
    _instance: typeof garbageProvider,
    accounts: string[]
  ) => accounts.map((account) => `Formatted: ${account}`);

  const garbageAddEventListener = (
    _instance: typeof garbageProvider,
    callback: (event: string[]) => void
  ) => {
    callback(['0']);
  };

  const garbageRemoveEventListener = (
    _: typeof garbageProvider,
    __: (event: string[]) => void
  ) => {};

  let builder: ChangeAccountSubscriberBuilder<
    string[],
    typeof garbageProvider,
    Actions<AutoImplementedActionsByRecommended>
  >;

  const setupNamespace = () => {
    const actions = new Map();
    const disconnectAction = vi.fn();
    actions.set('disconnect', disconnectAction);

    const store = createStore();
    const ns = new Namespace<TestNamespaceActions>('evm', 'garbage provider', {
      actions,
      store,
    });

    const context = { action: ns.run.bind(ns), state: ns.state.bind(ns) };

    return { ns, context, disconnectAction };
  };

  beforeEach(() => {
    builder = new ChangeAccountSubscriberBuilder();
  });

  test('throws error if required operators are not set', () => {
    expect(() => builder.build()).toThrow(
      `Required "getInstance" operation has not been set for "changeAccountSubscriber"`
    );

    builder.getInstance(() => garbageProvider);
    expect(() => builder.build()).toThrow(
      `Required "format" operation has not been set for "changeAccountSubscriber"`
    );

    builder.format(garbageFormatter);
    expect(() => builder.build()).toThrow(
      `Required "addEventListener" operation has not been set for "changeAccountSubscriber"`
    );

    builder.addEventListener(garbageAddEventListener);
    expect(() => builder.build()).toThrow(
      `Required "removeEventListener" operation has not been set for "changeAccountSubscriber"`
    );

    builder.removeEventListener(garbageRemoveEventListener);

    // should not throw now
    builder.build();
  });

  test('calls addEventListener and formats accounts correctly', async () => {
    const { context } = setupNamespace();
    const spiedAddEventListener = vi.fn(garbageAddEventListener);

    builder
      .getInstance(() => garbageProvider)
      .format(garbageFormatter)
      .addEventListener(spiedAddEventListener)
      .removeEventListener(garbageRemoveEventListener);

    const [subscriber] = builder.build();

    expect(spiedAddEventListener).toHaveBeenCalledTimes(0);
    subscriber(context);
    expect(spiedAddEventListener).toHaveBeenCalledTimes(1);

    const [getState] = context.state();
    await waitFor(() => {
      expect(getState('accounts')?.[0]).toBe('Formatted: 0');
    });
  });

  test('wont update accounts if preventDefault called', async () => {
    const { context } = setupNamespace();
    const spiedAddEventListener = vi.fn(garbageAddEventListener);
    const [getState, setState] = context.state();
    setState('accounts', ['Initial State']);
    builder
      .getInstance(() => garbageProvider)
      .format(garbageFormatter)
      .addEventListener(spiedAddEventListener)
      .onSwitchAccount((event) => {
        event.preventDefault();
      })
      .removeEventListener(garbageRemoveEventListener);

    const [subscriber] = builder.build();

    subscriber(context);
    await waitFor(() => {
      expect(getState('accounts')?.[0]).toBe('Initial State');
    });
  });

  test('calls removeEventListener', () => {
    const { context } = setupNamespace();
    const spiedRemoveEventListener = vi.fn(garbageRemoveEventListener);

    builder
      .getInstance(() => garbageProvider)
      .format(garbageFormatter)
      .addEventListener(garbageAddEventListener)
      .removeEventListener(spiedRemoveEventListener);

    const [, clearSubscriber] = builder.build();

    expect(spiedRemoveEventListener).toHaveBeenCalledTimes(0);
    clearSubscriber(context);
    expect(spiedRemoveEventListener).toHaveBeenCalledTimes(1);
  });

  test('calls addEventListener returned function', () => {
    const { context } = setupNamespace();
    const unsubscribe = vi.fn();

    const addEventListenerWithReturn = (
      _: typeof garbageProvider,
      __: (event: string[]) => void
    ) => {
      return unsubscribe;
    };

    builder
      .getInstance(() => garbageProvider)
      .format(garbageFormatter)
      .addEventListener(addEventListenerWithReturn)
      .removeEventListener(garbageRemoveEventListener);

    const [subscriber, clearSubscriber] = builder.build();

    subscriber(context);
    expect(unsubscribe).toHaveBeenCalledTimes(0);

    clearSubscriber(context);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
