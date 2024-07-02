import type { Token } from 'rango-sdk';

import { describe, expect, test } from 'vitest';

import { createToken } from '../../test-utils/fixtures';
import { createTokenHash } from '../../utils/meta';

import { calculateSupportedTokens } from './data'; // Adjust path as necessary

const tokens: Token[] = [
  { ...createToken(), blockchain: 'blockchainA' },
  { ...createToken(), blockchain: 'blockchainA' },
  { ...createToken(), blockchain: 'blockchainB' },
  { ...createToken(), blockchain: 'blockchainC' },
];

const mockData: Parameters<typeof calculateSupportedTokens>[0] = {
  type: 'source',
  meta: {
    tokensMapByTokenHash: new Map(),
    tokensMapByBlockchainName: {},
  },
  config: { tokens: [], blockchains: undefined },
};

tokens.forEach((token) => {
  const tokenHash = createTokenHash(token);
  mockData.meta.tokensMapByTokenHash.set(tokenHash, token);
  if (!mockData.meta.tokensMapByBlockchainName[token.blockchain]) {
    mockData.meta.tokensMapByBlockchainName[token.blockchain] = [];
  }
  mockData.meta.tokensMapByBlockchainName[token.blockchain].push(tokenHash);
});

describe('calculateSupportedTokens', () => {
  test('should include tokens from config.tokens array that exist in meta', () => {
    mockData.config = {
      blockchains: undefined,
      tokens: [tokens[0], tokens[1]],
    };

    const result = calculateSupportedTokens(mockData);
    expect(result).toEqual([tokens[0], tokens[1]]);
  });

  test('should include all tokens from the meta if config.blockchains is not defined and config.tokens type is object', () => {
    mockData.config = {
      blockchains: undefined,
      tokens: {
        [tokens[0].blockchain]: { tokens: [tokens[0]], isExcluded: false },
        [tokens[1].blockchain]: { tokens: [tokens[1]], isExcluded: false },
      },
    };

    const result = calculateSupportedTokens(mockData);
    expect(result).toEqual(tokens);
  });

  test('should include tokens from config.tokens object that exist in meta', () => {
    mockData.config = {
      blockchains: [tokens[0].blockchain, tokens[2].blockchain],
      tokens: {
        [tokens[0].blockchain]: { tokens: [tokens[0]], isExcluded: false },
        [tokens[2].blockchain]: { tokens: [tokens[2]], isExcluded: false },
      },
    };
    const result = calculateSupportedTokens(mockData);
    expect(result).toEqual([tokens[0], tokens[2]]);
  });

  test('should not include tokens from config.tokens whose blockchain does not exist in config.blockchains', () => {
    mockData.config = {
      blockchains: [tokens[0].blockchain],
      tokens: {
        [tokens[2].blockchain]: { tokens: [tokens[2]], isExcluded: false },
      },
    };
    const result = calculateSupportedTokens(mockData);
    expect(result).toEqual([tokens[0], tokens[1]]);
  });

  test('should include all tokens from a blockchain if that blockchain does not have any tokens in config.tokens', () => {
    mockData.config = {
      blockchains: [tokens[0].blockchain],
      tokens: {},
    };
    const result = calculateSupportedTokens(mockData);
    expect(result).toEqual([tokens[0], tokens[1]]);
  });

  test('should include all tokens from config.blockchains that exist in the meta, except tokens excluded in config.token', () => {
    mockData.config = {
      blockchains: [tokens[0].blockchain],
      tokens: {
        [tokens[0].blockchain]: { tokens: [tokens[0]], isExcluded: true },
      },
    };
    const result = calculateSupportedTokens(mockData);
    expect(result).toEqual([tokens[1]]);
  });
});
