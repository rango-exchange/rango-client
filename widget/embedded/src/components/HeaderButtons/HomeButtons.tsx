import type { HomeButtonsPropTypes } from './HeaderButtons.types';

import { i18n } from '@lingui/core';
import {
  NotificationsIcon,
  Popover,
  RefreshIcon,
  SettingsIcon,
  Tooltip,
  TransactionIcon,
} from '@rango-dev/ui';
import React from 'react';

import { NotificationContent } from '../NotificationContent';

import { HeaderButton } from './HeaderButtons.styles';
import { UnreadNotificationsBadge } from './UnreadNotificationsBadge';

export function HomeButtons(props: HomeButtonsPropTypes) {
  const {
    layoutRef,
    onClickRefresh,
    onClickHistory,
    onClickSettings,
    onClickNotifications,
  } = props;

  return (
    <>
      <Tooltip side="top" content={i18n.t('Refresh')}>
        <HeaderButton
          variant="ghost"
          size="small"
          onClick={onClickRefresh}
          disabled={!onClickRefresh}>
          <RefreshIcon size={18} color={!onClickRefresh ? 'gray' : 'black'} />
        </HeaderButton>
      </Tooltip>

      <Tooltip side="top" content={i18n.t('Notifications')}>
        <Popover
          align="center"
          collisionBoundary={layoutRef}
          collisionPadding={{ right: 20, left: 20 }}
          container={document.getElementById('swap-box') as HTMLElement}
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
      <Tooltip side="top" content={i18n.t('Settings')}>
        <HeaderButton size="small" variant="ghost" onClick={onClickSettings}>
          <SettingsIcon size={18} color="black" />
        </HeaderButton>
      </Tooltip>
      <Tooltip side="top" content={i18n.t('Transactions History')}>
        <HeaderButton size="small" variant="ghost" onClick={onClickHistory}>
          <TransactionIcon size={18} color="black" />
        </HeaderButton>
      </Tooltip>
    </>
  );
}
