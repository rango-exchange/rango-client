import type { DeleteContentProps } from './SwapDetailsModal.types';

import { i18n } from '@lingui/core';
import { Button, Divider, MessageBox, Typography } from '@rango-dev/ui';
import React from 'react';

export const DeleteContent = ({ onDelete, onClose }: DeleteContentProps) => {
  return (
    <>
      <Divider size={20} />
      <MessageBox
        type="error"
        title={i18n.t('Delete Transaction')}
        description={i18n.t('Are you sure you want to delete this swap?')}
      />
      <Divider size={32} />
      <Button
        variant="contained"
        type="primary"
        size="large"
        onClick={onDelete}>
        {i18n.t('Yes, Delete it')}
      </Button>
      <Divider size={12} />
      <Button variant="outlined" type="primary" size="large" onClick={onClose}>
        <Typography variant="title" size="medium" color="primary">
          {i18n.t('No, Cancel')}
        </Typography>
      </Button>
    </>
  );
};
