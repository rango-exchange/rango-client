import { Typography } from '@rango-dev/ui';
import React from 'react';

import { useNotificationStore } from '../../store/notification';

import { NotificationsBadgeContainer } from './HeaderButtons.styles';

export function UnreadNotificationsBadge() {
  const { getUnreadNotifications } = useNotificationStore();

  const notificationsCount = getUnreadNotifications().length;

  return notificationsCount ? (
    <NotificationsBadgeContainer>
      <Typography variant="body" size="xsmall" color="$background">
        {notificationsCount}
      </Typography>
    </NotificationsBadgeContainer>
  ) : null;
}
