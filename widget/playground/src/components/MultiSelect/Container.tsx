import type { PropsWithChildren } from 'react';

import { Button, Divider, styled, Typography } from '@rango-dev/ui';
import { InfoCircleIcon } from '@rango-dev/ui/src/components/Icon';
import React from 'react';

import { useMetaStore } from '../../store/meta';

type PropTypes = {
  label: string;
  onOpenModal: () => void;
  titleBtn?: string;
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

export function Container({
  label,
  onOpenModal,
  children,
  titleBtn = 'Select',
}: PropsWithChildren<PropTypes>) {
  const loadingStatus = useMetaStore.use.loadingStatus();

  return (
    <>
      <Head>
        <Typography noWrap variant="body" size="small" color="neutral700">
          {label}
        </Typography>

        <Button
          onClick={onOpenModal}
          variant="ghost"
          loading={loadingStatus === 'loading'}
          disabled={loadingStatus === 'failed'}
          size="small"
          suffix={
            loadingStatus === 'failed' && (
              <InfoCircleIcon color="error" size={24} />
            )
          }
          type="primary">
          {titleBtn}
        </Button>
      </Head>
      <Divider size={16} />
      <Body>{children}</Body>
    </>
  );
}
