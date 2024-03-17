import type { BlockchainMeta, EvmBlockchainMeta, Token } from 'rango-sdk';

import { faker } from '@faker-js/faker';
import { TransactionType } from 'rango-sdk';

import {
  BLOCKCHAINS_COUNT,
  listBlockchains,
  listTokens,
  TOKENS_COUNT,
} from './constants';

const FAKER_SEED = 9595;
faker.seed(FAKER_SEED);

export function createToken(options?: { blockchains?: string[] }) {
  const fromBlockchains = options?.blockchains ?? listBlockchains;

  return {
    address: faker.datatype.boolean() ? faker.finance.ethereumAddress() : null,
    blockchain: faker.helpers.arrayElement(fromBlockchains),
    coinSource: faker.datatype.boolean() ? faker.word.noun() : null,
    coinSourceUrl: faker.datatype.boolean() ? faker.internet.url() : null,
    decimals: faker.number.int(),
    usdPrice: faker.datatype.boolean() ? faker.number.float() : null,
    isPopular: faker.datatype.boolean(),
    image: faker.internet.url(),
    symbol: faker.helpers.arrayElement(listTokens),
    name: faker.datatype.boolean() ? faker.hacker.verb() : null,
    supportedSwappers: faker.datatype.boolean()
      ? faker.helpers.multiple(faker.string.sample)
      : undefined,
    isSecondaryCoin: faker.datatype.boolean(),
  };
}
export function createTokens(
  count: number,
  options?: {
    blockchains?: string[];
  }
): Token[] {
  return Array(count)
    .fill(null)
    .map(() => createToken({ blockchains: options?.blockchains }));
}

export function createEvmBlockchain(): EvmBlockchainMeta {
  const name = faker.helpers.arrayElement(listBlockchains);
  return {
    name: name,
    shortName: faker.string.alpha({
      length: 3,
    }),
    displayName: faker.string.alpha(),
    defaultDecimals: faker.number.int(),
    addressPatterns: faker.helpers.multiple(faker.string.sample),
    logo: faker.internet.url(),
    color: faker.helpers.fake('#{{number.hex()}}'),
    sort: faker.number.int({ min: 1, max: BLOCKCHAINS_COUNT }),
    enabled: faker.datatype.boolean(),
    feeAssets: [
      {
        blockchain: faker.helpers.arrayElement(
          listBlockchains.filter((item) => item !== name)
        ),
        symbol: faker.helpers.arrayElement(listTokens),
        address: faker.datatype.boolean()
          ? faker.finance.ethereumAddress()
          : null,
      },
    ],
    type: TransactionType.EVM,
    chainId: faker.string.hexadecimal({
      length: 2,
    }),
    info: {
      infoType: 'EvmMetaInfo',
      chainName: faker.hacker.adjective(),
      nativeCurrency: {
        name: faker.hacker.noun(),
        symbol: faker.helpers.arrayElement(listTokens),
        decimals: faker.number.int(),
      },
      rpcUrls: faker.helpers.multiple(faker.internet.url),
      blockExplorerUrls: faker.helpers.multiple(faker.internet.url),
      addressUrl: faker.internet.url(),
      transactionUrl: faker.internet.url(),
    },
  };
}

export function createEvmBlockchains(count: number): EvmBlockchainMeta[] {
  return Array(count)
    .fill(null)
    .map(() => createEvmBlockchain());
}

export function createInitialAppStore() {
  const blockchains = createEvmBlockchains(BLOCKCHAINS_COUNT);
  const tokens = createTokens(TOKENS_COUNT, {
    blockchains: blockchains.map((b) => b.name),
  });

  return {
    _tokens: tokens,
    _blockchainsMapByName: new Map<string, BlockchainMeta>(
      blockchains.map((meta) => [meta.name, meta])
    ),
  };
}
