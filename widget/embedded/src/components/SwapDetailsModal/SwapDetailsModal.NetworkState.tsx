import type { NetworkStateContentProps } from './SwapDetailsModal.types';

import { MessageBox } from '@rango-dev/ui';
import React from 'react';

export const NetworkStateContent = (props: NetworkStateContentProps) => {
  const { switchNetworkModalState } = props;

  return (
    <MessageBox
      type={switchNetworkModalState.type}
      title={switchNetworkModalState.title}
      description={switchNetworkModalState.description}
    />
  );
};
