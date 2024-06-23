import { i18n } from '@lingui/core';
import React from 'react';

import { Divider, Typography } from '../../components';
import { NoNotificationIcon } from '../../icons';

import { NotFoundContainer } from './Notifications.styles';

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
