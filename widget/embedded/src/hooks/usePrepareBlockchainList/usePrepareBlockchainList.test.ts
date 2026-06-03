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
    const preferredBlockchains = ['LINEA', 'BASE'];
    const sortedBlockchainsList = sample.sort(
      generateSortByPreferredBlockchainsFor(preferredBlockchains)
    );

    const expected = [
      'LINEA',
      'BASE',
      'ETH',
      'BSC',
      'ARBITRUM',
      'POLYGON',
      'OPTIMISM',
      'SCROLL',
    ];
    const received = sortedBlockchainsList.map((blockchain) => blockchain.name);

    expect(expected).toEqual(received);
  });

  it('should prepare the list by most used and user preferences', () => {
    const listLimit = 4;
    const preferredBlockchains = ['LINEA', 'SCROLL'];
    const expected = [
      'LINEA',
      'SCROLL',
      'ETH',
      'BSC',
      'ARBITRUM',
      'POLYGON',
      'OPTIMISM',
      'BASE',
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

    // Check preferred blockchains end up in the main list
    preferredBlockchains.forEach((blockchain) => {
      expect(receivedListNames).toContain(blockchain);
    });
  });

  it('should prepare the list correctly if user has a long list of preferences', () => {
    const listLimit = 4;
    const preferredBlockchains = [
      'LINEA',
      'SCROLL',
      'BASE',
      'OPTIMISM',
      'POLYGON',
    ];
    const expected = [
      'LINEA',
      'SCROLL',
      'BASE',
      'OPTIMISM',
      'POLYGON',
      'ETH',
      'BSC',
      'ARBITRUM',
    ];
    const received = prepare(sample, preferredBlockchains, {
      limit: listLimit,
    });

    expect(expected).toEqual([
      ...received.list.map((blockchain) => blockchain.name),
      ...received.more.map((blockchain) => blockchain.name),
    ]);
  });

  it('Last item of the main list should be moved to front if it selected again.', () => {
    const listLimit = 4;
    const preferredBlockchains = ['POLYGON', 'BASE'];
    const expected = [
      'POLYGON',
      'BASE',
      'ETH',
      'BSC',
      'ARBITRUM',
      'OPTIMISM',
      'LINEA',
      'SCROLL',
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
