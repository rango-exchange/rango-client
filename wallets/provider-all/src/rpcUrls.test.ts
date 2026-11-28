import { describe, expect, test } from 'vitest';

import { toNamespacesRPCUrls } from './rpcUrls.js';

const BSC_CHAIN_ID = 56;
const POLYGON_CHAIN_ID = 137;

describe('toNamespacesRPCUrls', () => {
  test('gives every EVM chain its own urls and viem chain', () => {
    const { evm } = toNamespacesRPCUrls({
      evm: {
        1: ['https://eth.example'],
        [BSC_CHAIN_ID]: ['https://a.bsc', 'https://b.bsc'],
      },
    });

    expect(evm).toHaveLength(2);
    expect(evm?.map(({ chain, rpcUrls }) => [chain.id, rpcUrls])).toEqual([
      [1, ['https://eth.example']],
      [BSC_CHAIN_ID, ['https://a.bsc', 'https://b.bsc']],
    ]);
    expect(evm?.[1]?.chain.rpcUrls.default.http).toEqual([
      'https://a.bsc',
      'https://b.bsc',
    ]);
  });

  test('leaves out chains without urls and invalid chain ids', () => {
    const { evm } = toNamespacesRPCUrls({
      evm: { 1: [], 10: [''], [POLYGON_CHAIN_ID]: ['https://polygon.example'] },
    });

    expect(evm?.map(({ chain }) => chain.id)).toEqual([POLYGON_CHAIN_ID]);
    expect(
      toNamespacesRPCUrls({
        evm: { 0: ['https://x'] },
      })
    ).toEqual({});
  });

  test('has no urls of its own', () => {
    expect(toNamespacesRPCUrls()).toEqual({});
    expect(toNamespacesRPCUrls({})).toEqual({});
  });
});
