/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes } from './BlockchainsSection.types';

import { i18n } from '@lingui/core';
import {
  BlockchainsChip,
  Divider,
  Image,
  Skeleton,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { usePrepareBlockchainList } from '../../hooks/usePrepareBlockchainList';
import { useBestRouteStore } from '../../store/bestRoute';
import { useMetaStore } from '../../store/meta';

import { Container } from './BlockchainsSection.styles';

const LIST_SIZE = 10;
const NUMBER_OF_LOADING = 12;

export function BlockchainsSection(props: PropTypes) {
  const { blockchains, type, blockchain, onChange, onMoreClick } = props;
  const blockchainsList = usePrepareBlockchainList(blockchains, {
    limit: LIST_SIZE,
    selected: blockchain?.name,
  });

  const loadingStatus = useMetaStore.use.loadingStatus();
  const resetToBlockchain = useBestRouteStore.use.resetToBlockchain();
  const resetFromBlockchain = useBestRouteStore.use.resetFromBlockchain();
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
            {blockchainsList.list.map((item) => (
              <BlockchainsChip
                key={item.chainId}
                selected={!!blockchain && blockchain.chainId === item.chainId}
                onClick={() => onChange(item)}>
                <Image src={item.logo} size={30} />
              </BlockchainsChip>
            ))}

            {blockchainsList.more.length ? (
              <BlockchainsChip onClick={onMoreClick}>
                <Typography variant="body" size="xsmall" color="secondary500">
                  {i18n._('More +{count}', {
                    count: blockchainsList.more.length,
                  })}
                </Typography>
              </BlockchainsChip>
            ) : null}
          </>
        )}
      </Container>
    </div>
  );
}
