import type { SwapDetailsPlaceholderPropTypes } from './SwapDetails.types';

import { i18n } from '@lingui/core';
import { NotFound, Spinner } from '@rango-dev/ui';
import React from 'react';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { SuffixContainer } from '../HeaderButtons/HeaderButtons.styles';
import { Layout } from '../Layout';

import { LoaderContainer, PlaceholderContainer } from './SwapDetails.styles';

export function SwapDetailsPlaceholder(props: SwapDetailsPlaceholderPropTypes) {
  const { requestId, loading } = props;
  const { navigateBackFrom } = useNavigateBack();

  return (
    <Layout
      header={{
        title: i18n.t('Swap and Bridge'),
        onBack: navigateBackFrom.bind(null, navigationRoutes.swapDetails),
        suffix: <SuffixContainer />,
      }}>
      <PlaceholderContainer>
        {loading ? (
          <LoaderContainer>
            <Spinner size={24} />
          </LoaderContainer>
        ) : (
          <NotFound
            title={i18n.t('Not found')}
            description={i18n.t(
              'swapNotFound',
              { requestId },
              { message: 'Swap with request ID = ${requestId} not found.' }
            )}
          />
        )}
      </PlaceholderContainer>
    </Layout>
  );
}
