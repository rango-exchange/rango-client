import type {
  PrepareListOptions,
  PrepareListOutput,
} from './usePrepareBlockchainList.types';
import type { BlockchainMeta } from 'rango-sdk';

import { useEffect } from 'react';

import { useSettingsStore } from '../../store/settings';

import { prepare } from './usePrepareBlockchainList.helpers';

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
  const { preferredBlockchains, addPreferredBlockchain } = useSettingsStore();

  useEffect(() => {
    if (options?.selected) {
      addPreferredBlockchain(options?.selected);
    }
  }, [options?.selected]);

  const output = prepare(blockchains, preferredBlockchains, options);

  return {
    list: output.list,
    more: output.more,
    history: [],
  };
}
