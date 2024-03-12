import { EventSeverity } from '@rango-dev/queue-manager-rango-preset';
import { Typography } from '@rango-dev/ui';
import React from 'react';

import { useNotificationStore } from '../../store/notification';

import { NotificationsBadgeContainer } from './HeaderButtons.styles';

export function UnreadNotificationsBadge() {
  const { getUnreadNotifications } = useNotificationStore();

  const notificationsList = getUnreadNotifications();

  const notificationsCount = notificationsList.length;

  const hasSeverNotification = !!notificationsList.find(
    (notificationItem) =>
      notificationItem.event.messageSeverity === EventSeverity.WARNING
  );

  return notificationsCount ? (
    <NotificationsBadgeContainer isSever={hasSeverNotification}>
      <Typography variant="body" size="xsmall" color="$background">
        {notificationsCount}
      </Typography>
    </NotificationsBadgeContainer>
  ) : null;
}
