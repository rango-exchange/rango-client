import React from 'react';
import { BlockchainSelector } from '@rangodev/ui';
import { useRouteStore } from '../store/route';
import { useMetaStore } from '../store/meta';

interface PropTypes {
  type: 'from' | 'to';
}

export function SelectChain(props: PropTypes) {
  const { type } = props;

  const {
    meta: { blockchains },
  } = useMetaStore();
  const { fromChain, toChain, setFromChain, setToChain } = useRouteStore();

  return (
    <BlockchainSelector
      type={type === 'from' ? 'Source' : 'Destination'}
      list={blockchains}
      selected={type === 'from' ? fromChain : toChain}
      onChange={(chain) => {
        if (type === 'from') setFromChain(chain);
        else setToChain(chain);
      }}
    />
  );
}
