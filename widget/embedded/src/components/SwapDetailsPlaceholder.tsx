import React from 'react';
import { SecondaryPage, Spinner, Alert, styled } from '@rango-dev/ui';
import { LoaderContainer } from '../pages/WalletsPage';

const PlaceholderContainer = styled('div', { height: '450px' });

interface PropTypes {
  requestId: string;
  loading: boolean;
  onBack: () => void;
}

export function SwapDetailsPlaceholder(props: PropTypes) {
  const { requestId, loading, onBack } = props;

  return (
    <SecondaryPage title="Swap Details" textField={false} onBack={onBack}>
      <PlaceholderContainer>
        {loading ? (
          <LoaderContainer>
            <Spinner size={24} />
          </LoaderContainer>
        ) : (
          <Alert
            type="secondary"
            title={`Swap with request ID = ${requestId} not found.`}
          />
        )}
      </PlaceholderContainer>
    </SecondaryPage>
  );
}
