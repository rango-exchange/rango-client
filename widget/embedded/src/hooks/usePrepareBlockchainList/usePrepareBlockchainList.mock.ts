import type { BlockchainMeta, EvmBlockchainMeta } from 'rango-sdk';

import { TransactionType } from 'rango-sdk';

export const sampleDefaultBlockchainNames = [
  'ETH',
  'BSC',
  'ARBITRUM',
  'POLYGON',
  'OPTIMISM',
  'BASE',
  'LINEA',
  'SCROLL',
];

const EVM_DECIMALS = 18;

function evm(
  name: string,
  displayName: string,
  chainId: string,
  sort: number
): EvmBlockchainMeta {
  return {
    name,
    defaultDecimals: EVM_DECIMALS,
    addressPatterns: ['^(0x)[0-9A-Fa-f]{40}$'],
    feeAssets: [
      {
        blockchain: name,
        symbol: 'ETH',
        address: null,
      },
    ],
    logo: `https://api.rango.exchange/blockchains/${name.toLowerCase()}.svg`,
    displayName,
    shortName: displayName,
    sort,
    color: '#000000',
    enabled: true,
    type: TransactionType.EVM,
    chainId,
    info: {
      infoType: 'EvmMetaInfo',
      chainName: displayName,
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: EVM_DECIMALS,
      },
      rpcUrls: [`https://rpc.example.com/${name.toLowerCase()}`],
      blockExplorerUrls: [`https://explorer.example.com/${name.toLowerCase()}`],
      addressUrl: `https://explorer.example.com/${name.toLowerCase()}/address/{wallet}`,
      transactionUrl: `https://explorer.example.com/${name.toLowerCase()}/tx/{txHash}`,
      enableGasV2: true,
      tokenUrl: `https://explorer.example.com/${name.toLowerCase()}/token/{address}`,
    },
  };
}

const evmSamples: Array<[string, string, string]> = [
  ['ETH', 'Ethereum', '0x1'],
  ['BSC', 'BNB Smart Chain', '0x38'],
  ['ARBITRUM', 'Arbitrum', '0xa4b1'],
  ['POLYGON', 'Polygon', '0x89'],
  ['OPTIMISM', 'Optimism', '0xa'],
  ['BASE', 'Base', '0x2105'],
  ['LINEA', 'Linea', '0xe708'],
  ['SCROLL', 'Scroll', '0x82750'],
];

export const sampleBlockchains: BlockchainMeta[] = evmSamples.map(
  ([name, displayName, chainId], index) =>
    evm(name, displayName, chainId, index)
);
