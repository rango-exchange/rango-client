import { i18n } from '@lingui/core';
import React from 'react';

import { Divider, Typography } from '../../components/index.js';
import { NoNotificationIcon } from '../../icons/index.js';

import { NotFoundContainer } from './Notifications.styles.js';

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
