import type { BlockchainMeta } from 'rango-sdk';

import { beforeEach, describe, expect, it } from 'vitest';

import { MOST_USED_BLOCKCHAINS } from './usePrepareBlockchainList.constants';
import {
  generateSortByPreferredBlockchainsFor,
  prepare,
  sortByMostUsedBlockchains,
} from './usePrepareBlockchainList.helpers';
import { sampleBlockchains } from './usePrepareBlockchainList.mock';

describe('usePrepareBlockchainList', () => {
  let sample: BlockchainMeta[] = [];

  beforeEach(() => {
    sample = JSON.parse(JSON.stringify(sampleBlockchains));
  });

  it('should sort blockchains by most used ones.', () => {
    const sortedBlockchainsList = sample.sort(sortByMostUsedBlockchains);

    const mostUsedCount = MOST_USED_BLOCKCHAINS.length;
    const expected = MOST_USED_BLOCKCHAINS;
    const received = sortedBlockchainsList
      .map((blockchain) => blockchain.name)
      .slice(0, mostUsedCount);

    expect(expected).toEqual(received);
  });

  it('should sort blockchains by user preferences', () => {
    const preferredBlockchains = ['UMEE', 'BANDCHAIN', 'LINEA'];
    const sortedBlockchainsList = sample.sort(
      generateSortByPreferredBlockchainsFor(preferredBlockchains)
    );

    const expected = [
      'UMEE',
      'BANDCHAIN',
      'LINEA',
      'ETH',
      'BSC',
      'ARBITRUM',
      'POLYGON',
      'ZKSYNC',
      'STARKNET',
      'OPTIMISM',
      'AVAX_CCHAIN',
      'POLYGONZK',
      'TRON',
      'BTC',
      'COSMOS',
      'OSMOSIS',
      'NEUTRON',
      'NOBLE',
      'SOLANA',
      'CRONOS',
      'BNB',
      'AURORA',
      'MAYA',
      'THOR',
      'BOBA',
      'MOONBEAM',
      'MOONRIVER',
      'OKC',
      'BOBA_AVALANCHE',
      'LTC',
      'BCH',
      'HECO',
      'STARGAZE',
      'CRYPTO_ORG',
      'CHIHUAHUA',
      'COMDEX',
      'REGEN',
      'IRIS',
      'EMONEY',
      'JUNO',
      'STRIDE',
      'MARS',
      'TERRA',
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
      'DESMOS',
      'LUMNETWORK',
    ];
    const received = sortedBlockchainsList.map((blockchain) => blockchain.name);

    expect(expected).toEqual(received);
  });

  it('should prepare the list by most used and user preferences', () => {
    const listLimit = 10;
    const preferredBlockchains = ['BTC', 'SOLANA', 'COSMOS', 'ETH'];
    const expected = [
      'BTC',
      'SOLANA',
      'ETH',
      'COSMOS',
      'OSMOSIS',
      'BSC',
      'ARBITRUM',
      'POLYGON',
      'ZKSYNC',
      'STARKNET',
      'OPTIMISM',
      'AVAX_CCHAIN',
      'POLYGONZK',
      'LINEA',
      'TRON',
      'NEUTRON',
      'NOBLE',
      'CRONOS',
      'BNB',
      'AURORA',
      'MAYA',
      'THOR',
      'BOBA',
      'MOONBEAM',
      'MOONRIVER',
      'OKC',
      'BOBA_AVALANCHE',
      'LTC',
      'BCH',
      'HECO',
      'STARGAZE',
      'CRYPTO_ORG',
      'CHIHUAHUA',
      'BANDCHAIN',
      'COMDEX',
      'REGEN',
      'IRIS',
      'EMONEY',
      'JUNO',
      'STRIDE',
      'MARS',
      'TERRA',
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
    ];
    const received = prepare(sample, preferredBlockchains, {
      limit: listLimit,
    });

    const receivedListNames = received.list.map(
      (blockchain) => blockchain.name
    );
    const receivedMoreNames = received.more.map(
      (blockchain) => blockchain.name
    );

    expect(received.list).toHaveLength(listLimit);
    expect(received.more).toHaveLength(expected.length - listLimit);
    expect(expected).toEqual([...receivedListNames, ...receivedMoreNames]);

    // Check duplication
    receivedListNames.forEach((listName) => {
      expect(receivedMoreNames).not.toContain(listName);
    });

    // Check preferred blockchains to be on the main list
    preferredBlockchains.forEach((blockchain) => {
      expect(receivedListNames).toContain(blockchain);
    });
  });

  it('should prepare the list correctly if user has a long list of preferences ', () => {
    const listLimit = 10;
    const preferredBlockchains = [
      'ETH',
      'BTC',
      'SOLANA',
      'CRYPTO_ORG',
      'TRON',
      'BOBA_AVALANCHE',
      'AKASH',
      'LUMNETWORK',
      'KONSTELLATION',
      'BANDCHAIN',
      'INJECTIVE',
    ];
    const expected = [
      'ETH',
      'BTC',
      'SOLANA',
      'CRYPTO_ORG',
      'TRON',
      'BOBA_AVALANCHE',
      'AKASH',
      'LUMNETWORK',
      'KONSTELLATION',
      'BANDCHAIN',
      'INJECTIVE',
      'COSMOS',
      'OSMOSIS',
      'BSC',
      'ARBITRUM',
      'POLYGON',
      'ZKSYNC',
      'STARKNET',
      'OPTIMISM',
      'AVAX_CCHAIN',
      'POLYGONZK',
      'LINEA',
      'NEUTRON',
      'NOBLE',
      'CRONOS',
      'BNB',
      'AURORA',
      'MAYA',
      'THOR',
      'BOBA',
      'MOONBEAM',
      'MOONRIVER',
      'OKC',
      'LTC',
      'BCH',
      'HECO',
      'STARGAZE',
      'CHIHUAHUA',
      'COMDEX',
      'REGEN',
      'IRIS',
      'EMONEY',
      'JUNO',
      'STRIDE',
      'MARS',
      'TERRA',
      'BITSONG',
      'KI',
      'PERSISTENCE',
      'MEDIBLOC',
      'KUJIRA',
      'SENTINEL',
      'SECRET',
      'STARNAME',
      'BITCANNA',
      'UMEE',
      'DESMOS',
    ];
    const received = prepare(sample, preferredBlockchains, {
      limit: listLimit,
    });

    expect(expected).toEqual([
      ...received.list.map((blockchain) => blockchain.name),
      ...received.more.map((blockchain) => blockchain.name),
    ]);
  });

  it.only('Last item of the main list should be moved to front if it selected again.', () => {
    const listLimit = 10;
    const preferredBlockchains = ['AVAX_CCHAIN', 'BTC'];
    const expected = [
      'AVAX_CCHAIN',
      'BTC',
      'ETH',
      'COSMOS',
      'OSMOSIS',
      'BSC',
      'ARBITRUM',
      'POLYGON',
      'ZKSYNC',
      'STARKNET',
      'OPTIMISM',
      'POLYGONZK',
      'LINEA',
      'TRON',
      'NEUTRON',
      'NOBLE',
      'SOLANA',
      'CRONOS',
      'BNB',
      'AURORA',
      'MAYA',
      'THOR',
      'BOBA',
      'MOONBEAM',
      'MOONRIVER',
      'OKC',
      'BOBA_AVALANCHE',
      'LTC',
      'BCH',
      'HECO',
      'STARGAZE',
      'CRYPTO_ORG',
      'CHIHUAHUA',
      'BANDCHAIN',
      'COMDEX',
      'REGEN',
      'IRIS',
      'EMONEY',
      'JUNO',
      'STRIDE',
      'MARS',
      'TERRA',
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
    ];

    const output = prepare(sample, preferredBlockchains, {
      limit: listLimit,
    });

    const received = [
      ...output.list.map((blockchain) => blockchain.name),
      ...output.more.map((blockchain) => blockchain.name),
    ];

    expect(expected).toEqual(received);
  });
});
