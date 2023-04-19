import React from 'react';
import { SecondaryPage, Spinner, Alert, styled } from '@rango-dev/ui';

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
