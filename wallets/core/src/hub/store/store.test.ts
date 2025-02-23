import type { Store } from './mod.js';

import { beforeEach, describe, expect, test } from 'vitest';

import { createStore } from './store.js';

describe('checking store', () => {
  let hubStore: Store;

  beforeEach(() => {
    hubStore = createStore();
  });

  test('new providers can be added to store', () => {
    const id = 'sol-or-something';
    const info = {
      info: {
        name: 'sol grabage wallet',
        icon: 'http://somewhere.world',
        extensions: {
          homepage: 'http://somewhere.world',
        },
      },
    };

    const { getState } = hubStore;
    getState().providers.addProvider(id, info);

    expect(getState().providers.list[id]).toBeDefined();
    expect(Object.keys(getState().providers.list).length).toBe(1);
  });
});
