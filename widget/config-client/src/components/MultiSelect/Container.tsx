import React, { PropsWithChildren } from 'react';
import { Button, InfoCircleIcon, Spacer, styled, Typography } from '@rango-dev/ui';
import { useMetaStore } from '../../store/meta';
type PropTypes = {
  label: string;
  onOpenModal: () => void;
};

const Head = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Body = styled('div', {
  maxHeight: 150,
  overflow: 'hidden auto',
});

const Row = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  maxHeight: 120,
  overflow: 'auto',
});

export function Container({ label, onOpenModal, children }: PropsWithChildren<PropTypes>) {
  const loadingStatus = useMetaStore.use.loadingStatus();

  return (
    <div>
      <Head>
        <Typography noWrap variant="h6">
          {label}
        </Typography>

        <Button
          onClick={onOpenModal}
          variant="contained"
          loading={loadingStatus === 'loading'}
          disabled={loadingStatus === 'failed'}
          size="small"
          suffix={loadingStatus === 'failed' && <InfoCircleIcon color="error" size={24} />}
          type="primary">
          Change
        </Button>
      </Head>
      <Spacer size={16} direction="vertical" />
      <Body>{children}</Body>
    </div>
  );
}
