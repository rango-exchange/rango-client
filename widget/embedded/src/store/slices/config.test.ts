import { describe, expect, test } from 'vitest';

import { DEFAULT_ETHEREUM_RPC_URL, rpcURLsFromConfig } from './config';

const BSC_CHAIN_ID = 56;

const urlsByChain = (config: Parameters<typeof rpcURLsFromConfig>[0]) =>
  rpcURLsFromConfig(config).evm?.map(({ chain, rpcUrls }) => [
    chain.id,
    rpcUrls,
  ]);

describe('rpcURLsFromConfig', () => {
  test('falls back to the default node on Ethereum when nothing is configured', () => {
    expect(urlsByChain({ apiKey: '' })).toEqual([
      [1, [DEFAULT_ETHEREUM_RPC_URL]],
    ]);
  });

  test('takes EVM urls per chain from rpcUrls', () => {
    expect(
      urlsByChain({
        apiKey: '',
        rpcUrls: { evm: { [BSC_CHAIN_ID]: ['https://bsc.example'] } },
      })
    ).toEqual([
      [1, [DEFAULT_ETHEREUM_RPC_URL]],
      [BSC_CHAIN_ID, ['https://bsc.example']],
    ]);
  });

  test("doesn't add the default node when Ethereum has urls", () => {
    expect(
      urlsByChain({
        apiKey: '',
        rpcUrls: { evm: { 1: ['https://eth.example'] } },
      })
    ).toEqual([[1, ['https://eth.example']]]);
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
