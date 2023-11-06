import { i18n } from '@lingui/core';
import React from 'react';

import { Alert, SecondaryPage, Spinner } from '../..';
import { styled } from '../../theme';

const PlaceholderContainer = styled('div', { height: '450px' });

export const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  paddingTop: '33%',
  flex: 1,
});

interface PropTypes {
  requestId: string;
  loading: boolean;
  onBack: () => void;
}

export function SwapDetailsPlaceholder(props: PropTypes) {
  const { requestId, loading, onBack } = props;

  return (
    <SecondaryPage
      title={i18n.t('Swap Details')}
      textField={false}
      onBack={onBack}>
      <PlaceholderContainer>
        {loading ? (
          <LoaderContainer>
            <Spinner size={24} />
          </LoaderContainer>
        ) : (
          <Alert
            type="error"
            title={i18n.t({
              id: 'Swap with request ID = {requestId} not found.',
              values: { requestId },
            })}
          />
        )}
      </PlaceholderContainer>
    </SecondaryPage>
  );
}
