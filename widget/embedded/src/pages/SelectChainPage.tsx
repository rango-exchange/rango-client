import React, { useEffect, useState } from 'react';
import { BlockchainSelector } from '@rangodev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useNavigate } from 'react-router-dom';
import { useWalletsStore } from '../store/wallets';
import { BlockchainMeta } from 'rango-sdk';

interface PropTypes {
  type: 'from' | 'to';
}

export function SelectChainPage(props: PropTypes) {
  const { type } = props;
  const accounts = useWalletsStore.use.accounts();

  const { blockchains } = useMetaStore.use.meta();
  const loadingStatus = useMetaStore.use.loadingStatus();
  const fromChain = useBestRouteStore.use.fromChain();
  const toChain = useBestRouteStore.use.toChain();
  const setFromChain = useBestRouteStore.use.setFromChain();
  const setToChain = useBestRouteStore.use.setToChain();
  const setFromToken = useBestRouteStore.use.setFromToken();
  const setToToken = useBestRouteStore.use.setToToken();

  const navigate = useNavigate();

  const [list, setList] = useState(blockchains);

  useEffect(() => {
    let chainSortedByConnectedWallets: BlockchainMeta[] = [];
    if (accounts.length !== 0) {
      const connectedChains = accounts.map((account) => account.blockchain);
      chainSortedByConnectedWallets = blockchains.sort(
        (blockchainA, blockchainB) =>
          connectedChains.lastIndexOf(blockchainA.name) -
          connectedChains.lastIndexOf(blockchainB.name),
      );
    } else {
      chainSortedByConnectedWallets = blockchains;
    }
    setList(chainSortedByConnectedWallets);
  }, [blockchains, accounts]);

  return (
    <BlockchainSelector
      type={type === 'from' ? 'Source' : 'Destination'}
      list={list}
      selected={type === 'from' ? fromChain : toChain}
      loadingStatus={loadingStatus}
      onChange={(chain) => {
        if (type === 'from') setFromChain(chain);
        else setToChain(chain);
        if (type === 'from' && fromChain?.name != chain.name) setFromToken(null);
        if (type === 'to' && toChain?.name != chain.name) setToToken(null);
        navigate(-1);
      }}
      onBack={navigate.bind(null, -1)}
    />
  );
}
