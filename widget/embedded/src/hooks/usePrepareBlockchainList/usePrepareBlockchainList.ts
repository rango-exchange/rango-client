import type {
  PrepareListOptions,
  UsePrepareList,
} from './usePrepareBlockchainList.types';
import type { BlockchainMeta } from 'rango-sdk';

import { useEffect } from 'react';

import { useAppStore } from '../../store/AppStore';

import { isInVisibleList, prepare } from './usePrepareBlockchainList.helpers';

/**
 *
 * UI needs some specific logics like limiting the list and sorting,
 * this function is getting the raw blockchains list and return a list for showing in UI.
 *
 */
export function usePrepareBlockchainList(
  blockchains: BlockchainMeta[],
  options?: PrepareListOptions
): UsePrepareList {
  const { preferredBlockchains, addPreferredBlockchain } = useAppStore();

  useEffect(() => {
    if (options?.selected) {
      const output = prepare(blockchains, preferredBlockchains, options);

      /**
       * We only add a new blockchain to preferred when it's not in the main list
       * In this way we can guarantee we will be able to regenerate the same list always.
       * And also it helps us to avoid jumping for the last item of the main list (e.g. tenth item of our list).
       */
      if (!isInVisibleList(options.selected, output)) {
        addPreferredBlockchain(options?.selected);
      }
    }
  }, [options?.selected]);

  const output = prepare(blockchains, preferredBlockchains, options);

  return {
    list: output.list,
    more: output.more,
    history: [],
  };
}
