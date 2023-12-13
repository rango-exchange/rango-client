import type { ModalNetworkValueTypes } from './SwapDetailsModal.types';

import { i18n } from '@lingui/core';
import { PendingSwapNetworkStatus } from 'rango-types';

export const modalNetworkValues: Record<
  Exclude<PendingSwapNetworkStatus, PendingSwapNetworkStatus.WaitingForQueue>,
  ModalNetworkValueTypes
> = {
  [PendingSwapNetworkStatus.WaitingForNetworkChange]: {
    type: 'loading',
    title: i18n.t('Change Network'),
  },
  [PendingSwapNetworkStatus.WaitingForConnectingWallet]: {
    type: 'warning',
    title: i18n.t('Connect Wallet'),
  },
  [PendingSwapNetworkStatus.NetworkChanged]: {
    type: 'success',
    title: i18n.t('Network Changed'),
  },
};
