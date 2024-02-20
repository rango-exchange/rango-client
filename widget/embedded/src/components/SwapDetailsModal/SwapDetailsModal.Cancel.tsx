import type { CancelContentProps } from './SwapDetailsModal.types';

import { i18n } from '@lingui/core';
import { Button, Divider, MessageBox } from '@rango-dev/ui';
import React from 'react';

export const CancelContent = ({ onCancel, onClose }: CancelContentProps) => {
  return (
    <>
      <Divider size={20} />
      <MessageBox
        type="error"
        title={i18n.t('Cancel Swap')}
        description={i18n.t('Are you sure you want to cancel this swap?')}
      />
      <Divider size={32} />
      <Button
        variant="contained"
        type="primary"
        size="large"
        onClick={onCancel}>
        {i18n.t('Yes, Cancel it')}
      </Button>
      <Divider size={12} />
      <Button variant="outlined" type="primary" size="large" onClick={onClose}>
        {i18n.t('No, Continue')}
      </Button>
    </>
  );
};
