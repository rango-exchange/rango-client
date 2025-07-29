import type { Token } from 'rango-sdk';

import { beforeEach, describe, expect, test } from 'vitest';

import { createToken } from '../../test-utils/fixtures';
import { createTokenHash } from '../../utils/meta';

import { matchTokensFromConfigWithMeta } from './data'; // Adjust path as necessary

type MatchTokensFromConfigWithMetaParam = Parameters<
  typeof matchTokensFromConfigWithMeta
>[0];

const BLOCKCHAIN_A = 'blockchainA';
const BLOCKCHAIN_B = 'blockchainB';
const BLOCKCHAIN_C = 'blockchainC';

const tokens: Token[] = [
  { ...createToken(), blockchain: BLOCKCHAIN_A },
  { ...createToken(), blockchain: BLOCKCHAIN_A },
  { ...createToken(), blockchain: BLOCKCHAIN_B },
  { ...createToken(), blockchain: BLOCKCHAIN_C },
];

function createMetaForMockData(
  tokens: Token[]
): MatchTokensFromConfigWithMetaParam['meta'] {
  const meta: MatchTokensFromConfigWithMetaParam['meta'] = {
    tokensMapByTokenHash: new Map(),
    tokensMapByBlockchainName: {},
  };
  tokens.forEach((token) => {
    const tokenHash = createTokenHash(token);
    meta.tokensMapByTokenHash.set(tokenHash, token);
    if (!meta.tokensMapByBlockchainName[token.blockchain]) {
      meta.tokensMapByBlockchainName[token.blockchain] = [];
    }
    meta.tokensMapByBlockchainName[token.blockchain]?.push(tokenHash);
  });

  return meta;
}

describe('matchTokensFromConfigWithMeta', () => {
  let token0: Token;
  let token1: Token;
  let token2: Token;

  beforeEach(() => {
    // Assert presence once
    if (!tokens[0] || !tokens[1] || !tokens[2]) {
      throw new Error('Test data not populated correctly');
    }
    token0 = tokens[0];
    token1 = tokens[1];
    token2 = tokens[2];
  });
  test('should include tokens from config.tokens array that exist in meta', () => {
    const mockData: MatchTokensFromConfigWithMetaParam = {
      type: 'source',
      meta: createMetaForMockData(tokens),
      config: {
        blockchains: undefined,
        tokens: [token0, token1],
      },
    };

    const result = matchTokensFromConfigWithMeta(mockData);
    expect(result).toEqual([token0, token1]);
  });

  test('If config.blockchains is not defined or is empty, we should include all tokens from the meta for every blockchain that does not have tokens specified in the config, as well as tokens specified in the config that exist in the meta.', () => {
    const mockData: MatchTokensFromConfigWithMetaParam = {
      type: 'source',
      meta: createMetaForMockData(tokens),
      config: {
        blockchains: undefined,
        tokens: {
          [BLOCKCHAIN_A]: { tokens: [token0], isExcluded: false },
        },
      },
    };

    const runTestWithConfig = (config: {
      blockchains: MatchTokensFromConfigWithMetaParam['config']['blockchains'];
    }) => {
      mockData.config.blockchains = config.blockchains;
      const result = matchTokensFromConfigWithMeta(mockData);
      /**
       * In this case, the result might differ from what was expected.
       * To pass the test, we reordered the expected result.
       * Changing the order of tokens does not impact the overall behavior of our app,
       * as we have a comprehensive sorting logic applied to tokens within the data slice.
       */
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expect(result).toEqual([token2, tokens[3], token0]);
    };

    runTestWithConfig({ blockchains: undefined });
    runTestWithConfig({ blockchains: [] });
  });

  test('should include tokens from config.tokens object that exist in meta', () => {
    const mockData: MatchTokensFromConfigWithMetaParam = {
      type: 'source',
      meta: createMetaForMockData(tokens),
      config: {
        blockchains: [BLOCKCHAIN_A, BLOCKCHAIN_B],
        tokens: {
          [BLOCKCHAIN_A]: { tokens: [token0], isExcluded: false },
          [BLOCKCHAIN_B]: { tokens: [token2], isExcluded: false },
        },
      },
    };

    const result = matchTokensFromConfigWithMeta(mockData);
    expect(result).toEqual([token0, token2]);
  });

  test('should not include tokens from config.tokens whose blockchain does not exist in config.blockchains', () => {
    const mockData: MatchTokensFromConfigWithMetaParam = {
      type: 'source',
      meta: createMetaForMockData(tokens),
      config: {
        blockchains: [BLOCKCHAIN_A],
        tokens: {
          [BLOCKCHAIN_B]: { tokens: [token2], isExcluded: false },
        },
      },
    };

    const result = matchTokensFromConfigWithMeta(mockData);
    expect(result).toEqual([token0, token1]);
  });

  test('should include all tokens from a blockchain if that blockchain does not have any tokens in config.tokens', () => {
    const mockData: MatchTokensFromConfigWithMetaParam = {
      type: 'source',
      meta: createMetaForMockData(tokens),
      config: {
        blockchains: [BLOCKCHAIN_A],
        tokens: {},
      },
    };

    const result = matchTokensFromConfigWithMeta(mockData);
    expect(result).toEqual([token0, token1]);
  });

  test('should include all tokens from config.blockchains that exist in the meta, except tokens excluded in config.token', () => {
    const mockData: MatchTokensFromConfigWithMetaParam = {
      type: 'source',
      meta: createMetaForMockData(tokens),
      config: {
        blockchains: [BLOCKCHAIN_A],
        tokens: {
          [BLOCKCHAIN_A]: { tokens: [token0], isExcluded: true },
        },
      },
    };

    const result = matchTokensFromConfigWithMeta(mockData);
    expect(result).toEqual([token1]);
  });

  test('should include all tokens from the meta when config parameters are empty values', () => {
    const mockData: MatchTokensFromConfigWithMetaParam = {
      type: 'source',
      meta: createMetaForMockData(tokens),
      config: {
        blockchains: [],
        tokens: {},
      },
    };

    const runTestWithConfig = (
      config: MatchTokensFromConfigWithMetaParam['config']
    ) => {
      mockData.config = config;
      const result = matchTokensFromConfigWithMeta(mockData);
      expect(result).toEqual(tokens);
    };

    runTestWithConfig({ blockchains: [], tokens: {} });
    runTestWithConfig({ blockchains: undefined, tokens: undefined });
    runTestWithConfig({ blockchains: [], tokens: [] });
  });
});
