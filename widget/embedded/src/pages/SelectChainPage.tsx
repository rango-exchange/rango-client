import React, { useEffect, useState } from 'react';
import { BlockchainSelector } from '@rangodev/ui';
import { useBestRouteStore } from '../store/bestRoute';
import { useMetaStore } from '../store/meta';
import { useNavigate } from 'react-router-dom';
import { useWalletsStore } from '../store/wallets';
import { BlockchainMeta } from 'rango-sdk';
import { removeDuplicateFrom } from '../utils/common';

interface PropTypes {
  type: 'from' | 'to';
}

export function SelectChainPage(props: PropTypes) {
  const { type } = props;
  const { accounts } = useWalletsStore();

  const {
    meta: { blockchains },
    loadingStatus,
  } = useMetaStore();
  const { fromChain, toChain, setFromChain, setToChain, setFromToken, setToToken } =
    useBestRouteStore();
  const navigate = useNavigate();

  const [list, setList] = useState(blockchains);

  useEffect(() => {
    let chainSortedByConnectedWallets: BlockchainMeta[] = [];
    if (accounts.length !== 0) {
      const connectedChains = removeDuplicateFrom(accounts.map((account) => account.chain));
      chainSortedByConnectedWallets = blockchains.sort(
        (blockchainA, blockchainB) =>
          connectedChains.lastIndexOf(blockchainA.name) -
          connectedChains.lastIndexOf(blockchainB.name),
      );
    } else {
      chainSortedByConnectedWallets = blockchains;
    }
    setList(chainSortedByConnectedWallets);
  }, [blockchains.length, accounts.length]);

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
