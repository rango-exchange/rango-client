import type { Type } from '../../types';

import { ChainsIcon } from '@rango-dev/ui';
import React from 'react';

import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import { getCategoryNetworks } from '../../helpers';
import { useConfigStore } from '../../store/config';
import { useMetaStore } from '../../store/meta';

export function SupportedBlockchains({ type }: { type: Type }) {
  const {
    config: { from, to },
    onChangeBlockChains,
    onChangeBlockChain,
    onChangeToken,
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
      networks: getCategoryNetworks([blockchain]),
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
  };

  return (
    <MultiSelect
      label="Supported Blockchains"
      icon={<ChainsIcon />}
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
      onChange={(items) => handleBlockchainChange(items)}
    />
  );
}
