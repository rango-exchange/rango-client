import type { WidgetConfig } from '../../types';
import type { AppStoreState } from '../app';
import type { EvmBlockchainMeta, Token } from 'rango-sdk';

import { assert, beforeEach, describe, expect, test } from 'vitest';

import { cacheService } from '../../services/cacheService';
import {
  createEvmBlockchain,
  createInitialAppStore,
  createToken,
  updateAppStoreConfig,
} from '../../test-utils/fixtures';
import { createTokenHash } from '../../utils/meta';
import { createAppStore } from '../app';

let appStoreState: AppStoreState;
let customTokens: [Token, Token, Token];
let rangoBlockchain: EvmBlockchainMeta;

const DEFAULT_CONFIG: WidgetConfig = {
  apiKey: '',
  walletConnectProjectId: 'e24844c5deb5193c1c14840a7af6a40b',
  title: undefined,
  multiWallets: true,
  excludeLiquiditySources: true,
  customDestination: true,
  variant: 'default',
  trezorManifest: {
    appUrl: 'https://widget.rango.exchange/',
    email: 'hi+trezorwidget@rango.exchange',
  },
  tonConnect: {
    manifestUrl:
      'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/manifests/tonconnect-manifest.json',
  },
};

beforeEach(() => {
  cacheService.clear();
  rangoBlockchain = createEvmBlockchain();

  customTokens = [
    {
      ...createToken(),
      symbol: 'RNG',
      name: 'Rango',
      blockchain: rangoBlockchain.name,
      address: '0x0000000000000000068701000000000000000000',
      isSecondaryCoin: false,
      isPopular: false,
    },
    {
      ...createToken(),
      symbol: 'DJG',
      name: 'Django',
      blockchain: rangoBlockchain.name,
      isSecondaryCoin: false,
      isPopular: false,
    },
    {
      ...createToken(),
      symbol: 'RABO',
      name: 'Rainbow',
      blockchain: rangoBlockchain.name,
      isSecondaryCoin: false,
      isPopular: false,
    },
  ];

  const initData = createInitialAppStore();
  initData._blockchainsMapByName.set(rangoBlockchain.name, rangoBlockchain);
  customTokens.forEach((token) => {
    const tokenHash = createTokenHash(token);
    initData._tokensMapByTokenHash.set(tokenHash, token);
    if (!initData._tokensMapByBlockchainName[token.blockchain]) {
      initData._tokensMapByBlockchainName[token.blockchain] = [];
    }
    initData._tokensMapByBlockchainName[token.blockchain]?.push(tokenHash);
  });

  const appStore = createAppStore(DEFAULT_CONFIG);
  appStore.setState(initData);
  appStoreState = appStore.getState();
});

describe('check sorting tokens is working correctly in app store', () => {
  test('put pinned tokens first', () => {
    const rangoToken = customTokens[0];

    appStoreState = updateAppStoreConfig(appStoreState, {
      from: {
        pinnedTokens: [
          {
            symbol: rangoToken.symbol,
            address: rangoToken.address,
            blockchain: rangoToken.blockchain,
          },
        ],
      },
    });

    const tokens = appStoreState.tokens({
      type: 'source',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe(rangoToken.symbol);
  });

  test('put tokens with balances first', () => {
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

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe(rangoToken.symbol);
  });

  test('put native tokens first', () => {
    const rangoToken = customTokens[0];
    appStoreState._blockchainsMapByName.set(rangoToken.blockchain, {
      ...rangoBlockchain,
      feeAssets: [
        {
          address: rangoToken.address,
          blockchain: rangoToken.blockchain,
          symbol: rangoToken.symbol,
        },
      ],
    });

    const tokens = appStoreState.tokens({
      type: 'source',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe(rangoToken.symbol);
  });

  test('put popular tokens first', () => {
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

  test('put secondary tokens at the end of list', () => {
    const tokens = appStoreState.tokens({
      type: 'source',
    });
    expect(tokens[tokens.length - 1]?.isSecondaryCoin).toBe(true);
  });

  test('put popular token with lowest blockchain sort at first', () => {
    const rangoToken = customTokens[0];
    const token = appStoreState.findToken(rangoToken);
    if (token) {
      token.isPopular = true;
    }
    appStoreState._blockchainsMapByName.set(rangoToken.blockchain, {
      ...rangoBlockchain,
      sort: 0,
    });

    const tokens = appStoreState.tokens({
      type: 'source',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe(rangoToken.symbol);
  });

  test('put pinned token first and tokens with balances second', () => {
    const rangoToken = customTokens[0];
    const djangoToken = customTokens[1];

    appStoreState = updateAppStoreConfig(appStoreState, {
      from: {
        pinnedTokens: [
          {
            symbol: rangoToken.symbol,
            address: rangoToken.address,
            blockchain: rangoToken.blockchain,
          },
        ],
      },
    });

    const tokens = appStoreState.tokens({
      type: 'source',
      getBalanceFor: (token: Token) => {
        if (token.symbol === djangoToken.symbol) {
          return {
            amount: '100',
            decimals: 12,
            usdValue: '5000',
          };
        }
        return null;
      },
    });

    const firstResult = tokens[0]?.symbol;
    const secondResult = tokens[1]?.symbol;
    expect(firstResult).toBe(rangoToken.symbol);
    expect(secondResult).toBe(djangoToken.symbol);
  });

  test('put pinned token first and tokens with balances second and popular tokens followed', () => {
    const rangoToken = customTokens[0];
    const djangoToken = customTokens[1];

    appStoreState = updateAppStoreConfig(appStoreState, {
      from: {
        pinnedTokens: [
          {
            symbol: rangoToken.symbol,
            address: rangoToken.address,
            blockchain: rangoToken.blockchain,
          },
        ],
      },
    });

    const tokens = appStoreState.tokens({
      type: 'source',
      getBalanceFor: (token: Token) => {
        if (token.symbol === djangoToken.symbol) {
          return {
            amount: '100',
            decimals: 12,
            usdValue: '5000',
          };
        }
        return null;
      },
    });

    const firstResult = tokens[0]?.symbol;
    const secondResult = tokens[1]?.symbol;

    const popularTokensCount = tokens.reduce((previousValue, current) => {
      if (current.isPopular) {
        return previousValue + 1;
      }
      return previousValue;
    }, 0);
    const popularResult = tokens.slice(2, popularTokensCount);

    expect(firstResult).toBe(rangoToken.symbol);
    expect(secondResult).toBe(djangoToken.symbol);
    assert(popularResult.every((token) => token.isPopular === true));
  });
});

describe('search in tokens', () => {
  test('should be first result when the symbol is exactly equal to the search term', () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'rng',
    });
    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe('RNG');
  });

  test('should be first result when the token name is exactly equal to the search term', () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'Rango',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe('RNG');
  });

  test('should be first result when symbol characters starts with search term ', () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'dj',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe('DJG');
  });

  test('should be first result when symbol characters contains search term', () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'abo',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe('RABO');
  });

  test('should be first result when token name characters starts with search term', () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'rang',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe('RNG');
  });

  test('should be first result when token name characters contains search term', () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'ngo',
    });

    // If there is more than one result, priority is given to the string that is shorter
    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe('RNG');
  });

  test('should be first result when address contains searched term', () => {
    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: '68701',
    });

    const firstResult = tokens[0]?.symbol;
    expect(firstResult).toBe('RNG');
  });

  test('put pinned token first and popular tokens followed when token name or symbol contains search term', () => {
    const djangoToken = customTokens[1];

    appStoreState = updateAppStoreConfig(appStoreState, {
      from: {
        pinnedTokens: [
          {
            symbol: djangoToken.symbol,
            address: djangoToken.address,
            blockchain: djangoToken.blockchain,
          },
        ],
      },
    });

    const tokens = appStoreState.tokens({
      type: 'source',
      searchFor: 'ngo',
    });

    const firstResult = tokens[0]?.symbol;
    const secondResult = tokens[1]?.symbol;

    expect(firstResult).toBe(djangoToken.symbol);
    expect(secondResult).toBe('RNG');
  });
});

describe('supported tokens from config', () => {
  test('Should ensure tokens include only tokens from the config', () => {
    const rangoToken = customTokens[0];
    const djangoToken = customTokens[1];

    const configTokens = [rangoToken, djangoToken];

    appStoreState = updateAppStoreConfig(appStoreState, {
      from: {
        tokens: configTokens,
      },
      to: { tokens: configTokens },
    });

    let sourceTokens = appStoreState.tokens({
      type: 'source',
    });

    let destinationTokens = appStoreState.tokens({
      type: 'destination',
    });

    expect(configTokens).toMatchObject(sourceTokens);
    expect(configTokens).toMatchObject(destinationTokens);

    appStoreState = updateAppStoreConfig(appStoreState, {
      from: {
        blockchains: [rangoBlockchain.name],
        tokens: {
          [rangoBlockchain.name]: {
            tokens: configTokens,
            isExcluded: false,
          },
        },
      },
      to: {
        blockchains: [rangoBlockchain.name],
        tokens: {
          [rangoBlockchain.name]: {
            tokens: configTokens,
            isExcluded: false,
          },
        },
      },
    });

    sourceTokens = appStoreState.tokens({
      type: 'source',
    });

    destinationTokens = appStoreState.tokens({
      type: 'destination',
    });

    expect(sourceTokens).toMatchObject(sourceTokens);
    expect(configTokens).toMatchObject(destinationTokens);
  });

  test('Check tokens calculation is caching', () => {
    const rangoToken = customTokens[0];
    const djangoToken = customTokens[1];

    appStoreState = updateAppStoreConfig(appStoreState, {
      from: {
        tokens: [rangoToken, djangoToken],
      },
    });

    expect(cacheService.get('supportedSourceTokens')?.length ?? 0).toBe(0);

    appStoreState.tokens({
      type: 'source',
    });

    expect(cacheService.get('supportedSourceTokens')?.length ?? 0).toBe(2);
  });
});
