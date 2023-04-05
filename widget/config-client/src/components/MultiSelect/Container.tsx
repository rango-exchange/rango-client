import React, { PropsWithChildren } from 'react';
import { Button, Spacer, styled, Typography } from '@rango-dev/ui';
type PropTypes = {
  label: string;
  loading?: boolean;
  disabled?: boolean;
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

const EmptyContent = styled('div', {
  textAlign: 'center',
  marginTop: '20%',
});
const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});
export function Container({
  label,
  loading,
  disabled,
  onOpenModal,
  children,
}: PropsWithChildren<PropTypes>) {
  return (
    <div>
      <Head>
        <Typography noWrap variant="h6">
          {label}
        </Typography>

        <Button
          onClick={onOpenModal}
          variant="contained"
          loading={loading}
          disabled={disabled}
          size="small"
          type="primary">
          Change
        </Button>
      </Head>
      <Spacer size={16} direction="vertical" />
      <Body>{children}</Body>
    </div>
  );
}
