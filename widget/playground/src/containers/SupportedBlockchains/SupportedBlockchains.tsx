import type { Type } from '../../types';

import { ChainsIcon } from '@rango-dev/ui';
import React from 'react';

import { MultiSelect } from '../../components/MultiSelect';
import { useConfigStore } from '../../store/config';
import { useMetaStore } from '../../store/meta';
import { getCategoryNetworks } from '../../utils/blockchains';

export function SupportedBlockchains({ type }: { type: Type }) {
  const {
    config: { from, to },
    onChangeBlockChains,
    onChangeBlockChain,
    onChangeToken,
    onChangeTokens,
  } = useConfigStore();
  const {
    meta: { blockchains },
  } = useMetaStore();

  const selectedType = type === 'Source' ? from : to;

  const configBlockchains = selectedType?.blockchains;

  const allBlockchains = blockchains.map((blockchain) => {
    const { displayName: title, logo, name } = blockchain;
    return {
      title,
      logo,
      name,
      supportedNetworks: getCategoryNetworks([blockchain]),
    };
  });

  const handleBlockchainChange = (items?: string[]) => {
    // Reset default blockchain and token when the default is not among the selected items.
    if (
      selectedType?.blockchain &&
      items &&
      !items.includes(selectedType.blockchain)
    ) {
      onChangeBlockChain(undefined, type);
      onChangeToken(undefined, type);
    }

    onChangeBlockChains(items, type);
    onChangeTokens(undefined, type);
  };

  return (
    <MultiSelect
      label="Supported Blockchains"
      icon={<ChainsIcon size={24} />}
      type="Blockchains"
      value={
        configBlockchains?.length === allBlockchains.length
          ? undefined
          : configBlockchains
      }
      defaultSelectedItems={
        configBlockchains || allBlockchains.map((blockchain) => blockchain.name)
      }
      list={allBlockchains}
      onChange={handleBlockchainChange}
      disabled={!blockchains?.length}
    />
  );
}
