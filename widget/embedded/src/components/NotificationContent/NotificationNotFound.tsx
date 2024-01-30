import { i18n } from '@lingui/core';
import { Divider, NoNotificationIcon, Typography } from '@rango-dev/ui';
import React from 'react';

import { NotFoundContainer } from './NotificationContent.styles';

export function NotificationNotFound() {
  return (
    <NotFoundContainer>
      <NoNotificationIcon color="secondary" size={26} />
      <Divider size={12} />
      <Typography variant="body" size="medium" color="neutral700">
        {i18n.t('There are no notifications.')}
      </Typography>
    </NotFoundContainer>
  );
}
