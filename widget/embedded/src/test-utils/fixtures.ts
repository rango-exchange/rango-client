import type { AppStoreState } from '../store/app';
import type { Blockchain, TokenHash, WidgetConfig } from '../types';
import type { BlockchainMeta, EvmBlockchainMeta, Token } from 'rango-sdk';

import { faker } from '@faker-js/faker';
import { TransactionType } from 'rango-sdk';

import { createTokenHash } from '../utils/meta';

const TOKENS_COUNT = 20;
const BLOCKCHAINS_COUNT = 20;

const listBlockchains = [
  'ETH',
  'BSC',
  'ARBITRUM',
  'POLYGON',
  'ZKSYNC',
  'STARKNET',
  'OPTIMISM',
  'AVAX_CCHAIN',
  'POLYGONZK',
  'BASE',
  'LINEA',
  'TRON',
  'BTC',
  'SCROLL',
  'COSMOS',
  'OSMOSIS',
  'METIS',
  'NEUTRON',
  'NOBLE',
  'DYDX',
  'SOLANA',
  'CRONOS',
  'BNB',
  'FANTOM',
  'AURORA',
  'MAYA',
  'THOR',
  'BOBA',
  'MOONBEAM',
  'MOONRIVER',
  'OKC',
  'BOBA_BNB',
  'BOBA_AVALANCHE',
  'LTC',
  'BCH',
  'HARMONY',
  'EVMOS',
  'HECO',
  'SIF',
  'BRISE',
  'STARGAZE',
  'FUSE',
  'CRYPTO_ORG',
  'CHIHUAHUA',
  'BANDCHAIN',
  'COMDEX',
  'REGEN',
  'IRIS',
  'EMONEY',
  'GNOSIS',
  'JUNO',
  'AXELAR',
  'STRIDE',
  'KCC',
  'MARS',
  'TERRA',
  'TELOS',
  'BITSONG',
  'AKASH',
  'KI',
  'PERSISTENCE',
  'MEDIBLOC',
  'KUJIRA',
  'SENTINEL',
  'INJECTIVE',
  'SECRET',
  'KONSTELLATION',
  'STARNAME',
  'BITCANNA',
  'UMEE',
  'DESMOS',
  'LUMNETWORK',
  'TERRA_CLASSIC',
  'DASH',
  'DOGE',
];

const listTokens = [
  'BTC',
  'ETH',
  'USDT',
  'BNB',
  'AVAX',
  'DOT',
  'LINK',
  'MATIC',
  'TRX',
  'BCH',
  'NEAR',
  'LTC',
  'ICP',
  'FIL',
  'ETC',
  'DAI',
  'ATOM',
  'IMX',
  'OP',
  'HBAR',
  'INJ',
  'XLM',
  'CRO',
  'RNDR',
  'GRT',
  'OKB',
  'VET',
  'MNT',
  'KAS',
  'THETA',
  'LDO',
  'FDUSD',
  'XRP',
  'RUNE',
  'UNI',
  'USDC',
  'LEO',
  'ADA',
  'TON',
  'STX',
  'APT',
  'SOL',
  'TIA',
  'FLOKI',
  'DOGE',
  'ARB',
  'PEPE',
  'SHIB',
  'TON',
];

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
      enableGasV2: faker.datatype.boolean(),
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

  const tokensMapByTokenHash: Map<TokenHash, Token> = new Map();
  const tokensMapByBlockchainName: Record<Blockchain, TokenHash[]> = {};
  tokens.forEach((token) => {
    const tokenHash = createTokenHash(token);
    if (!tokensMapByBlockchainName[token.blockchain]) {
      tokensMapByBlockchainName[token.blockchain] = [];
    }
    tokensMapByTokenHash.set(tokenHash, token);
    tokensMapByBlockchainName[token.blockchain]?.push(tokenHash);
  });

  return {
    _tokensMapByTokenHash: tokensMapByTokenHash,
    _tokensMapByBlockchainName: tokensMapByBlockchainName,
    _blockchainsMapByName: new Map<string, BlockchainMeta>(
      blockchains.map((meta) => [meta.name, meta])
    ),
  };
}

export function updateAppStoreConfig(
  appStoreState: AppStoreState,
  config: Partial<WidgetConfig>
): AppStoreState {
  appStoreState.config = {
    ...appStoreState.config,
    ...config,
  };

  return appStoreState;
}
