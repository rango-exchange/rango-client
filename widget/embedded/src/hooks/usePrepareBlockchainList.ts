import type { BlockchainMeta } from 'rango-sdk';

import { useMemo, useRef } from 'react';

interface PrepareListOptions {
  limit?: number;
  selected?: string;
}

interface PrepareListOutput {
  list: BlockchainMeta[];
  more: BlockchainMeta[];
}

/**
 *
 * UI needs some specific logics like limiting the list and sorting,
 * this function is getting the raw blockchains list and return a list for showing in UI.
 *
 */
export function usePrepareBlockchainList(
  blockchains: BlockchainMeta[],
  options?: PrepareListOptions
): PrepareListOutput {
  const prevSelectedBlockchain = useRef({ index: -1, name: '' });

  blockchains.sort(sortByMostUsedBlockchains);

  return useMemo(() => {
    const list: BlockchainMeta[] = blockchains;
    let more: BlockchainMeta[] = [];

    // Checking `limit` has set and it should be more than of the list items.
    if (options?.limit && blockchains.length > options.limit) {
      const start = options.limit;
      /** Try find the blockchain and returns the index. */
      const selectedIndex = options.selected
        ? blockchains.findIndex(
            (blockchains) => blockchains.name === options.selected
          )
        : -1;

      const prevSelectedBlockchainWasInMoreSection =
        prevSelectedBlockchain.current.index > options.limit - 1 &&
        !!blockchains.find(
          (blockchains) =>
            blockchains.name === prevSelectedBlockchain.current.name
        );

      /*
       * If the selected blockchain is in `more` section, we should move it to front of the list
       */
      if (
        options.selected &&
        ((prevSelectedBlockchainWasInMoreSection &&
          selectedIndex < options.limit - 1) ||
          selectedIndex > options.limit - 1)
      ) {
        blockchains.sort(
          generateSortBySelectedFor(
            prevSelectedBlockchainWasInMoreSection
              ? prevSelectedBlockchain.current.name
              : options.selected
          )
        );
      }

      /*
       * Splice will modify the original list and returns the deleted items
       * We use the deleted items as `more`
       */
      more = list.splice(start);
      prevSelectedBlockchain.current = {
        index: selectedIndex,
        name: options.selected ?? '',
      };
    }

    return {
      list,
      more,
    };
    //TODO: replace with better solution
  }, [JSON.stringify(blockchains)]);
}

function generateSortBySelectedFor(selected: string) {
  /** Move `selected` blockchain to the front of list. */
  return function sortBySelected(a: BlockchainMeta, b: BlockchainMeta) {
    if (a.name === selected) {
      return -1;
    }
    if (b.name === selected) {
      return 1;
    }

    return 0;
  };
}

/** There is a hardcoded list of blockchains that we want to show them first in the list. */
function sortByMostUsedBlockchains(a: BlockchainMeta, b: BlockchainMeta) {
  const mostUsed = ['ETH', 'COSMOS', 'OSMOSIS'];
  const aIndexInMostUsed = mostUsed.findIndex((token) => token === a.name);
  const bIndexInMostUsed = mostUsed.findIndex((token) => token === b.name);
  const aIsMostUsed = aIndexInMostUsed > -1;
  const bIsMostUsed = bIndexInMostUsed > -1;

  if (aIsMostUsed && bIsMostUsed) {
    return aIndexInMostUsed > bIndexInMostUsed ? 1 : -1;
  }

  if (aIsMostUsed) {
    return -1;
  }

  if (bIsMostUsed) {
    return 1;
  }

  return 0;
}
