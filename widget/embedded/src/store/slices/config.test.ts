import { describe, expect, test } from 'vitest';

import { rpcURLsFromConfig } from './config';

const BSC_CHAIN_ID = 56;

const urlsByChain = (config: Parameters<typeof rpcURLsFromConfig>[0]) =>
  rpcURLsFromConfig(config).evm?.map(({ chain, rpcUrls }) => [
    chain.id,
    rpcUrls,
  ]);

describe('rpcURLsFromConfig', () => {
  test('passes no urls when none are configured', () => {
    expect(rpcURLsFromConfig({ apiKey: '' })).toEqual({});
  });

  test('takes EVM urls per chain from rpcUrls', () => {
    expect(
      urlsByChain({
        apiKey: '',
        rpcUrls: { evm: { [BSC_CHAIN_ID]: ['https://bsc.example'] } },
      })
    ).toEqual([[BSC_CHAIN_ID, ['https://bsc.example']]]);
  });

  test('tries customEthereumRPC first on Ethereum', () => {
    expect(
      urlsByChain({
        apiKey: '',
        signers: { customEthereumRPC: 'https://custom.eth' },
        rpcUrls: { evm: { 1: ['https://eth.example'] } },
      })
    ).toEqual([[1, ['https://custom.eth', 'https://eth.example']]]);

    expect(
      urlsByChain({
        apiKey: '',
        signers: { customEthereumRPC: 'https://custom.eth' },
      })
    ).toEqual([[1, ['https://custom.eth']]]);
  });
});
