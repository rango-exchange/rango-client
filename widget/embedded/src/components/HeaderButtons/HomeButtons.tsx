import type { HomeButtonsPropTypes } from './HeaderButtons.types';

import { i18n } from '@lingui/core';
import {
  NotificationsIcon,
  Popover,
  SettingsIcon,
  Tooltip,
  TransactionIcon,
} from '@rango-dev/ui';
import React from 'react';

import { useAppStore } from '../../store/AppStore';
import { getContainer } from '../../utils/common';
import { isFeatureHidden } from '../../utils/settings';
import { NotificationContent } from '../NotificationContent';

import { HeaderButton } from './HeaderButtons.styles';
import { RefreshButton } from './RefreshButton';
import { UnreadNotificationsBadge } from './UnreadNotificationsBadge';

export function HomeButtons(props: HomeButtonsPropTypes) {
  const {
    layoutRef,
    onClickRefresh,
    onClickHistory,
    onClickSettings,
    onClickNotifications,
  } = props;

  const {
    config: { features },
  } = useAppStore();

  const isNotificationsHidden = isFeatureHidden('notification', features);

  return (
    <>
      <Tooltip
        container={getContainer()}
        side="top"
        content={i18n.t('Refresh')}>
        <RefreshButton onClick={onClickRefresh} />
      </Tooltip>

      {!isNotificationsHidden && (
        <Tooltip
          container={getContainer()}
          side="top"
          content={i18n.t('Notifications')}>
          <Popover
            align="center"
            collisionBoundary={layoutRef}
            collisionPadding={{ right: 20, left: 20 }}
            container={getContainer()}
            content={<NotificationContent />}>
            <HeaderButton
              size="small"
              variant="ghost"
              onClick={onClickNotifications}>
              <NotificationsIcon size={18} color="black" />
              <UnreadNotificationsBadge />
            </HeaderButton>
          </Popover>
        </Tooltip>
      )}
      <Tooltip
        container={getContainer()}
        side="top"
        content={i18n.t('Settings')}>
        <HeaderButton size="small" variant="ghost" onClick={onClickSettings}>
          <SettingsIcon size={18} color="black" />
        </HeaderButton>
      </Tooltip>
      <Tooltip
        container={getContainer()}
        side="top"
        content={i18n.t('Transactions History')}>
        <HeaderButton size="small" variant="ghost" onClick={onClickHistory}>
          <TransactionIcon size={18} color="black" />
        </HeaderButton>
      </Tooltip>
    </>
  );
}
