import type { AppStoreState } from './app';
import type { Token } from 'rango-sdk';

import { beforeEach, describe, expect, test } from 'vitest';

import { createAppStore } from './app';
import { initialData } from './mock';

let appStoreState: AppStoreState;

describe('check sort tokens in the app store works correctly', () => {
  beforeEach(() => {
    const appStore = createAppStore();
    appStore.setState(initialData);
    appStoreState = appStore.getState();
  });

  test('should be the first token equal to the pinned token', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
    });
    expect(tokens[0].symbol).equal('TON');
  });

  test('should be the second token equal to token that has a balance', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      getBalanceFor: (token: Token) => {
        if (token.symbol === 'BNB' && token.blockchain === 'ETH') {
          return {
            amount: '100',
            decimals: 12,
            usdValue: '5000',
          };
        }
        return null;
      },
    });
    expect(tokens[1].symbol).equal('BNB');
  });

  test('should be the second token equal to a popular token', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
    });
    expect(tokens[1]?.symbol).equal('SOL');
  });

  test('should be the first token equal to token whose symbol is exactly the searched term', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'TRX',
    });
    expect(tokens[0]?.symbol).equal('TRX');
  });

  test('should be the first token equal to token whose name is exactly the searched term', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'Tron',
    });
    expect(tokens[0]?.symbol).equal('TRX');
  });

  test('should be the first token equal to the token whose symbol starts with the searched term', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'st',
    });
    expect(tokens[0]?.symbol).equal('STALL');
  });

  test('should be the first token equal to the token whose symbol contains the searched term', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'all',
    });
    expect(tokens[0]?.symbol).equal('STALL');
  });

  test('should be the first token equal to the token whose name starts with the searched term', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'ste',
    });
    expect(tokens[0]?.symbol).equal('STALL2');
  });

  test('should be the first token equal to the token whose name contains the searched term', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'ell',
    });
    expect(tokens[0]?.symbol).equal('STALL2');
  });

  test('should be the first token equal to the token whose address contains the searched term', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: '68701',
    });
    expect(tokens[0]?.symbol).equal('ETH');
  });

  test('should be the first token equal to the native token of the selected blockchain', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      blockchain: 'POLYGON',
    });
    expect(tokens[0]?.symbol).equal('MATIC');
  });

  test('should be the last token equal to a secondary token', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
    });
    expect(tokens[tokens.length - 1]?.symbol).equal('KAVA');
  });

  test('should be the second token equal to the token whose blockchain has the lowest sort value', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
    });
    expect(tokens[2]?.symbol).equal('BTC');
  });
});
