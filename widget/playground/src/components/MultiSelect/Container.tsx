import React, { PropsWithChildren } from 'react';
import { Button, InfoCircleIcon, Divider, styled, Typography } from '@rango-dev/ui';
import { useMetaStore } from '../../store/meta';
type PropTypes = {
  label: string;
  onOpenModal: () => void;
};

const Head = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid $neutral100',
  paddingBottom: '$8',
});

const Body = styled('div', {
  maxHeight: 150,
  overflow: 'hidden auto',
});

export function Container({ label, onOpenModal, children }: PropsWithChildren<PropTypes>) {
  const loadingStatus = useMetaStore.use.loadingStatus();

  return (
    <>
      <Head>
        <Typography noWrap variant="body2" color="neutral700">
          {label}
        </Typography>

        <Button
          onClick={onOpenModal}
          variant="ghost"
          loading={loadingStatus === 'loading'}
          disabled={loadingStatus === 'failed'}
          size="small"
          suffix={loadingStatus === 'failed' && <InfoCircleIcon color="error" size={24} />}
          type="primary">
          Select
        </Button>
      </Head>
      <Divider size={16} direction="vertical" />
      <Body>{children}</Body>
    </>
  );
}
