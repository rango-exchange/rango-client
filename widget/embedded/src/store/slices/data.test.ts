import type { AppStoreState } from '../app';
import type { EvmBlockchainMeta, Token } from 'rango-sdk';

import { assert, beforeEach, describe, expect, test } from 'vitest';

import {
  createEvmBlockchain,
  createInitialAppStore,
  createToken,
} from '../../test-utils/fixtures';
import { createAppStore } from '../app';

let appStoreState: AppStoreState;
let customTokens: [Token, Token, Token];
let rangoBlockchain: EvmBlockchainMeta;

beforeEach(() => {
  rangoBlockchain = createEvmBlockchain();

  customTokens = [
    {
      ...createToken(),
      symbol: 'RNG',
      name: 'Rango',
      blockchain: rangoBlockchain.name,
      address: '0x0000000000000000068701000000000000000000',
    },
    {
      ...createToken(),
      symbol: 'DJG',
      name: 'Django',
      blockchain: rangoBlockchain.name,
    },
    {
      ...createToken(),
      symbol: 'RABO',
      name: 'Rainbow',
      blockchain: rangoBlockchain.name,
    },
  ];

  const initData = createInitialAppStore();
  initData._blockchainsMapByName.set(rangoBlockchain.name, rangoBlockchain);
  customTokens.forEach((token) => initData._tokens.push(token));

  const appStore = createAppStore();
  appStore.setState(initData);
  appStoreState = appStore.getState();
});

describe('check sorting tokens is working correctly in app store', () => {
  test('put pinned tokens first', async () => {
    const rangoToken = customTokens[0];

    // TODO: write a test util to update config.
    appStoreState.config.from = {
      ...appStoreState.config.from,
      pinnedTokens: [
        {
          symbol: rangoToken.symbol,
          address: rangoToken.address,
          blockchain: rangoToken.blockchain,
        },
      ],
    };

    const tokens = appStoreState.tokens({
      type: 'source',
    });

    const firstResult = tokens[0].symbol;
    expect(firstResult).toBe(rangoToken.symbol);
  });

  test('put tokens with balances first', async () => {
    const rangoToken = customTokens[0];

    const tokens = appStoreState.tokens({
      type: 'source',
      getBalanceFor: (token: Token) => {
        if (token.symbol === rangoToken.symbol) {
          return {
            amount: '100',
            decimals: 12,
            usdValue: '5000',
          };
        }
        return null;
      },
    });

    const firstResult = tokens[0].symbol;
    expect(firstResult).equal(rangoToken.symbol);
  });

  test('put popular tokens first', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
    });
    const popularTokensCount = tokens.reduce((previousValue, current) => {
      if (current.isPopular) {
        return previousValue + 1;
      }
      return previousValue;
    }, 0);

    /*
     * Getting an slice of tokens which is equals to how many popular tokens exist
     * then we can check all of them should be on top of the list
     */
    const result = tokens.slice(0, popularTokensCount);
    assert(result.every((token) => token.isPopular === true));
  });

  test('should be first when search contains some part of token address', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: '68701',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).equal('RNG');
  });

  test.skip('should be the first token equal to the native token of the selected blockchain', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      blockchain: 'POLYGON',
    });
    expect(tokens[0]?.symbol).equal('MATIC');
  });

  test('put secondary tokens at the end of list', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
    });
    expect(tokens[tokens.length - 1]?.isSecondaryCoin).toBe(true);
  });

  test.skip('should be the second token equal to the token whose blockchain has the lowest sort value', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
    });
    expect(tokens[2]?.symbol).equal('BTC');
  });

  test.todo('pinned tokens + balance combination');
  test.todo('pinned tokens + balance + popular combination');
});

describe('search in tokens', () => {
  test('search by token symbol when symbol is exact matched', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'rng',
    });
    const firstResult = tokens[0]?.symbol;
    expect(firstResult).equal('RNG');
  });

  test('search by token name when name is exact matched', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'Rango',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).equal('RNG');
  });

  test('should be first result when search starts with first symbol characters', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'dj',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).equal('DJG');
  });

  test('should be first result when search contains characters from symbol', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'ng',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).equal('RNG');
  });

  test('should be first result when search starts with first token name characters', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'rang',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).equal('RNG');
  });

  // TODO: I'm not sure which one is correct, Rango or Django
  test.skip('should be first result when search contains characters from token name', async () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'ngo',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).equal('RNG');
  });

  test.todo('pinned tokens + search combination');
});
