/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PropTypes } from './BlockchainsSection.types';

import { i18n } from '@lingui/core';
import {
  ChainsChip,
  Divider,
  Image,
  Skeleton,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { useBestRouteStore } from '../../store/bestRoute';
import { useMetaStore } from '../../store/meta';

import { Container } from './BlockchainsSection.styles';

export function BlockchainsSection(props: PropTypes) {
  const { blockchains, type, blockchain, onChange, onMoreClick } = props;

  const loadingStatus = useMetaStore.use.loadingStatus();
  const resetToChain = useBestRouteStore.use.resetToChain();
  const resetFromChain = useBestRouteStore.use.resetFromChain();

  return (
    <div>
      <Divider size={12} />
      <Typography variant="label" size="large">
        {i18n.t('Select Chain')}
      </Typography>
      <Divider size={12} />
      <Container>
        {loadingStatus === 'loading' ? (
          Array.from(Array(12), (e) => (
            <Skeleton key={e} variant="rounded" height={50} />
          ))
        ) : (
          <>
            <ChainsChip
              selected={!blockchain}
              onClick={() => {
                if (type === 'from') {
                  resetFromChain();
                } else {
                  resetToChain();
                }
              }}>
              <Typography variant="body" size="xsmall" color="secondary">
                {i18n.t('All')}
              </Typography>
            </ChainsChip>
            {blockchains.slice(0, 10).map((chain) => (
              <ChainsChip
                selected={!!blockchain && blockchain.chainId === chain.chainId}
                key={chain.chainId}
                onClick={() => onChange(chain)}>
                <Image src={chain.logo} size={30} />
              </ChainsChip>
            ))}

            <ChainsChip onClick={onMoreClick}>
              <Typography variant="body" size="xsmall" color="secondary">
                {i18n.t(`More +${blockchains.length - 10}`)}
              </Typography>
            </ChainsChip>
          </>
        )}
      </Container>
    </div>
  );
}
