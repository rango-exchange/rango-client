import type {
  PrepareListOptions,
  PrepareOutput,
} from './usePrepareBlockchainList.types';
import type { BlockchainMeta } from 'rango-sdk';

import { MOST_USED_BLOCKCHAINS } from './usePrepareBlockchainList.constants';

export function prepare(
  blockchains: BlockchainMeta[],
  preferredBlockchains: string[],
  options?: PrepareListOptions
): PrepareOutput {
  /*
   * TODO:
   * We copying the `blockchains` which can causes performance penalties but we should because we are mutating the original object.
   * A better way to solve the problem maybe is using new JS features like Use toSpliced() but
   * we can not use it right now because we need to upgrade our toolings first.
   */
  const list: BlockchainMeta[] = JSON.parse(JSON.stringify(blockchains));
  let more: BlockchainMeta[] = [];

  list.sort(sortByMostUsedBlockchains);

  // Checking `limit` has set and it should be more than of the list items.
  if (!!options?.limit && blockchains.length > options.limit) {
    const start = options.limit;
    let preferredBlockchainsWithoutMainList = preferredBlockchains;

    if (preferredBlockchains.length <= options.limit) {
      /**
       *
       * if we want to show 10 items (aka `options.limit`)
       * and have these items as our preferred list: [x,y,z]
       * and these as our main list: [A, B, C, D, E, F, G, H, I, J]
       * the final list will be like this: [...preferred, ...mainList].
       *
       * Since we have a limit (e.g. 10) on our list (preferred + mainList),
       * we only should check those items from main list that will be in final list.
       *
       * finalListWithoutLimit = [x,y,z, A, B, C, D, E, F, G, H, I, J]
       * finalListWithLimit = [x,y,z, A, B, C, D, E, F, G]
       *
       * As you can see, [H, I, J] will not be in our list.
       *
       * The following code only check preffred blockchain
       * shouldn't be in first 7 of 10 items in main list. (Since, the last 3 items will not be in the final list and we should check those.)
       */
      const howManyItemsShouldBeCheckedFromMainList =
        options.limit - preferredBlockchains.length;

      for (let i = 0; i <= howManyItemsShouldBeCheckedFromMainList; i++) {
        const blockchain = list[i];

        preferredBlockchainsWithoutMainList =
          preferredBlockchainsWithoutMainList.filter((preferredBlockchain) => {
            return blockchain.name !== preferredBlockchain;
          });
      }
    }

    list.sort(
      generateSortByPreferredBlockchainsFor(preferredBlockchainsWithoutMainList)
    );

    /*
     * Splice will modify the original list and returns the deleted items
     * We use the deleted items as `more`
     */
    more = list.splice(start);
  }
  return {
    list,
    more,
  };
}

/** There is a hardcoded list of blockchains that we want to show them first in the list. */
export function sortByMostUsedBlockchains(
  a: BlockchainMeta,
  b: BlockchainMeta
) {
  const mostUsed = MOST_USED_BLOCKCHAINS;
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

export function generateSortByPreferredBlockchainsFor(
  preferredBlockchains: string[]
) {
  return function sortByPreferred(a: BlockchainMeta, b: BlockchainMeta) {
    const aIndexInPreferred = preferredBlockchains.findIndex(
      (blockchain) => blockchain === a.name
    );
    const bIndexInPreferred = preferredBlockchains.findIndex(
      (blockchain) => blockchain === b.name
    );

    const aIsPreferred = aIndexInPreferred > -1;
    const bIsPreferred = bIndexInPreferred > -1;

    if (aIsPreferred && bIsPreferred) {
      return aIndexInPreferred > bIndexInPreferred ? 1 : -1;
    }

    if (preferredBlockchains.includes(a.name)) {
      return -1;
    }
    if (preferredBlockchains.includes(b.name)) {
      return 1;
    }

    return 0;
  };
}

export function isInVisibleList(
  blockchain: string,
  prepareOutput: PrepareOutput
): boolean {
  return !!prepareOutput.list.find((item) => item.name === blockchain);
}
