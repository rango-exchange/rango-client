/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes } from './BlockchainsSection.types';

import { i18n } from '@lingui/core';
import { Divider, Image, Skeleton, Typography } from '@rango-dev/ui';
import { type BlockchainMeta } from 'rango-sdk';
import React, { useEffect, useState } from 'react';

import { useBestRouteStore } from '../../store/bestRoute';
import { useMetaStore } from '../../store/meta';
import { BlockchainsChip } from '../BlockchainsChip';

import { sortBlockchains } from './BlockchainSection.helpers';
import { Container } from './BlockchainsSection.styles';

const MIN = 9;
const MAX = 10;
const NUMBER_OF_LOADING = 12;
export function BlockchainsSection(props: PropTypes) {
  const { blockchains, type, blockchain, onChange, onMoreClick } = props;
  const sortedBlockchains = sortBlockchains(blockchains);
  const [selectFromMoreBlockchain, setSelectFromMoreBlockchain] =
    useState<BlockchainMeta | null>(null);
  const loadingStatus = useMetaStore.use.loadingStatus();
  const resetToBlockchain = useBestRouteStore.use.resetToBlockchain();
  const resetFromBlockchain = useBestRouteStore.use.resetFromBlockchain();
  const COUNT_BLOCKCHAINS = !!selectFromMoreBlockchain ? MIN : MAX;

  useEffect(() => {
    const selectBlockchainFromMore = sortedBlockchains
      .slice(MAX, sortedBlockchains.length)
      .find(
        (item) =>
          item.chainId === blockchain?.chainId && item.name === blockchain?.name
      );
    if (!!selectBlockchainFromMore) {
      setSelectFromMoreBlockchain(selectBlockchainFromMore);
    }
  }, [blockchain]);

  return (
    <div>
      <Divider size={12} />
      <Typography variant="label" size="large">
        {i18n.t('Select Blockchain')}
      </Typography>
      <Divider size={12} />
      <Container>
        {loadingStatus === 'loading' &&
          Array.from(Array(NUMBER_OF_LOADING), (e) => (
            <Skeleton key={e} variant="rounded" height={50} />
          ))}
        {loadingStatus === 'success' && (
          <>
            <BlockchainsChip
              selected={!blockchain}
              onClick={() => {
                if (type === 'from') {
                  resetFromBlockchain();
                } else {
                  resetToBlockchain();
                }
              }}>
              <Typography variant="body" size="xsmall" color="secondary500">
                {i18n.t('All')}
              </Typography>
            </BlockchainsChip>
            {!!selectFromMoreBlockchain && (
              <BlockchainsChip
                selected={
                  !!selectFromMoreBlockchain &&
                  selectFromMoreBlockchain.chainId === blockchain?.chainId
                }
                key={selectFromMoreBlockchain.chainId}
                onClick={() => onChange(selectFromMoreBlockchain)}>
                <Image src={selectFromMoreBlockchain.logo} size={30} />
              </BlockchainsChip>
            )}
            {sortedBlockchains.slice(0, COUNT_BLOCKCHAINS).map((item) => (
              <BlockchainsChip
                key={item.chainId}
                selected={!!blockchain && blockchain.chainId === item.chainId}
                onClick={() => onChange(item)}>
                <Image src={item.logo} size={30} />
              </BlockchainsChip>
            ))}

            <BlockchainsChip onClick={onMoreClick}>
              <Typography variant="body" size="xsmall" color="secondary500">
                {i18n._('More +{count}', {
                  count: sortedBlockchains.length - MAX,
                })}
              </Typography>
            </BlockchainsChip>
          </>
        )}
      </Container>
    </div>
  );
}
