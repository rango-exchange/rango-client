import type { PropTypes } from './RefreshModal.types';

import { i18n } from '@lingui/core';
import { Divider, MessageBox, RefreshIcon } from '@rango-dev/ui';
import React from 'react';

import { getContainer } from '../../utils/common';
import { WatermarkedModal } from '../common/WatermarkedModal';

import { RefreshButton } from './RefreshModal.styles';

export function RefreshModal(props: PropTypes) {
  const { open, onClose } = props;

  return (
    <WatermarkedModal
      open={open}
      dismissible
      onClose={onClose}
      container={getContainer()}>
      <MessageBox
        title={i18n.t('Something went wrong')}
        type="error"
        description={i18n.t('Something went wrong. Please refresh the app.')}>
        <Divider size={30} />
        <RefreshButton
          variant="outlined"
          size="large"
          type="primary"
          fullWidth
          onClick={() => location.reload()}>
          <RefreshIcon size={20} color="primary" />
          <Divider size={4} direction="horizontal" />
          {i18n.t('Refresh')}
        </RefreshButton>
      </MessageBox>
    </WatermarkedModal>
  );
}
