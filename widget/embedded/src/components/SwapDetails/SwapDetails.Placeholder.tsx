import type { SwapDetailsPlaceholderPropTypes } from './SwapDetails.types';

import { i18n } from '@lingui/core';
import {
  CopyIcon,
  IconButton,
  NotFound,
  Skeleton,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { SuffixContainer } from '../HeaderButtons/HeaderButtons.styles';
import { Layout } from '../Layout';
import { LoadingSwapDetails } from '../LoadingSwapDetails';

import {
  Container,
  HeaderDetails,
  PlaceholderContainer,
  requestIdStyles,
  rowStyles,
} from './SwapDetails.styles';

export function SwapDetailsPlaceholder(props: SwapDetailsPlaceholderPropTypes) {
  const { requestId, showSkeleton } = props;
  return (
    <Layout
      noPadding
      header={{
        title: i18n.t('Swap and Bridge'),
        suffix: <SuffixContainer />,
      }}>
      {showSkeleton && (
        <Container>
          <HeaderDetails>
            <div className={rowStyles()}>
              <Typography variant="label" size="large" color="neutral700">
                {`${i18n.t('Request ID')}:`}
              </Typography>
              <div className={requestIdStyles()}>
                <Typography variant="label" size="small" color="neutral700">
                  <Skeleton width={60} height={10} variant="rounded" />
                </Typography>
                <IconButton variant="ghost">
                  <CopyIcon size={16} color="gray" />
                </IconButton>
              </div>
            </div>
            <div className={rowStyles()}>
              <Typography variant="label" size="large" color="neutral700">
                {`${i18n.t('Created at')}:`}
              </Typography>
              <Typography variant="label" size="small" color="neutral700">
                <Skeleton width={60} height={10} variant="rounded" />
              </Typography>
            </div>
          </HeaderDetails>
          <LoadingSwapDetails />
        </Container>
      )}
      {!showSkeleton && (
        <PlaceholderContainer>
          <NotFound
            title={i18n.t('Not found')}
            description={i18n.t({
              id: 'Swap with request ID = {requestId} not found.',
              values: { requestId },
            })}
          />
        </PlaceholderContainer>
      )}
    </Layout>
  );
}
