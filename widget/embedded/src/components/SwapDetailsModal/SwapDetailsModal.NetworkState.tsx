import type { NetworkStateContentProps } from './SwapDetailsModal.types';

import { i18n } from '@lingui/core';
import { MessageBox } from '@rango-dev/ui';
import React from 'react';

export const NetworkStateContent = (props: NetworkStateContentProps) => {
  const { status, message } = props;

  const type = status === 'waitingForNetworkChange' ? 'loading' : 'success';
  const title =
    status === 'waitingForNetworkChange'
      ? i18n.t('Change Network')
      : i18n.t('Network Changed');

  return <MessageBox type={type} title={title} description={message} />;
};
