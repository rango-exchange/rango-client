import type { Notification } from '../../types/notification';

import { Notifications } from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';
import { getBlockchainImage } from '../../utils/meta';

export function NotificationContent() {
  const navigate = useNavigate();

  const { getNotifications, clearNotifications } = useNotificationStore();

  const notifications: Notification[] = getNotifications();
  const blockchains = useAppStore().blockchains();
  const { findToken } = useAppStore();

  const onClickItem = (requestId: Notification['requestId']) => {
    navigate(`${navigationRoutes.swaps}/${requestId}`);
  };

  return (
    <Notifications
      list={notifications}
      getBlockchainImage={(blockchain) =>
        getBlockchainImage(blockchain, blockchains) ?? ''
      }
      getTokenImage={(token) => findToken(token)?.image ?? ''}
      onClickItem={onClickItem}
      onClearAll={clearNotifications}
    />
  );
}
