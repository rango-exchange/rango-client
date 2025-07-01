import type { NetworkStateContentProps } from './SwapDetailsModal.types';

import { i18n } from '@lingui/core';
import { Button, Divider, MessageBox } from '@rango-dev/ui';
import React from 'react';

export const NetworkStateContent = (props: NetworkStateContentProps) => {
  const { switchNetworkModalState, handleSwitchNetwork } = props;

  return (
    <>
      <MessageBox
        type={switchNetworkModalState.type}
        title={switchNetworkModalState.title}
        description={switchNetworkModalState.description}
      />
      {switchNetworkModalState.type === 'error' && (
        <>
          <Divider size="30" />
          <Button
            id="widget-switch-network-try-again"
            type="primary"
            size="large"
            onClick={handleSwitchNetwork}>
            {i18n.t('Try Again')}
          </Button>
        </>
      )}
    </>
  );
};
