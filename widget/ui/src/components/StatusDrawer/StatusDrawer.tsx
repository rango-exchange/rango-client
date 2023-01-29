import React from 'react';
import { styled } from '../../theme';
import { Button } from '../Button';
import { Drawer } from '../Drawer';
import { CheckCircle, InfoCircle, Warning } from '../Icon';
import { Spacer } from '../Spacer';
import { Typography } from '../Typography';

export interface PropTypes {
  open: boolean;
  onClose: () => void;
  status: 'continue' | 'success' | 'failed';
  title: string;
  subtitle: string;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
const Header = styled('div', {
  textAlign: 'center',
});
const Footer = styled('div', {
  padding: '$20',
  display: 'flex',
  alignItems: 'center',
});
export function StatusDrawer({
  status = 'success',
  title,
  subtitle,
  onSubmit,
  onCancel,
  ...props
}: PropTypes) {
  return (
    <Drawer
      content={
        <>
          <Header>
            {status === 'success' ? (
              <CheckCircle color="success" size={24} />
            ) : status === 'failed' ? (
              <InfoCircle color="error" size={24} />
            ) : (
              <Warning color="warning" size={24} />
            )}
            <Typography variant="h6">{title}</Typography>
          </Header>
          <Typography variant="body2" mt={12}>
            {subtitle}
          </Typography>
        </>
      }
      footer={
        <Footer>
          {status !== 'failed' && (
            <Button fullWidth onClick={onCancel}>
              {status === 'success' ? 'Cancel' : 'See detailes'}
            </Button>
          )}
          <Spacer size={16} />
          <Button
            fullWidth
            onClick={onSubmit}
            variant="contained"
            type="primary"
          >
            {status === 'success'
              ? 'Done'
              : status === 'continue'
              ? 'Continue'
              : 'See detailes'}
          </Button>
        </Footer>
      }
      anchor="bottom"
      {...props}
    />
  );
}
