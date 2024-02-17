import type { HeaderButtonsPropTypes } from './HeaderButtons.types';

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

export function HeaderButtons(props: HeaderButtonsPropTypes) {
  const {
    onClickRefresh,
    onClickHistory,
    onClickSettings,
    hidden = [],
  } = props;

  const {
    config: { features },
  } = useAppStore();

  const isNotificationsHidden =
    isFeatureHidden('notification', features) ||
    hidden.includes('notifications');

  return (
    <>
      {!hidden.includes('refresh') && (
        <Tooltip
          container={getContainer()}
          side="top"
          content={i18n.t('Refresh')}>
          <RefreshButton onClick={onClickRefresh} />
        </Tooltip>
      )}

      {!isNotificationsHidden && (
        <Popover
          align="end"
          alignOffset={-88}
          collisionPadding={{ right: 20, left: 20 }}
          container={getContainer()}
          content={<NotificationContent />}>
          <div>
            <Tooltip
              container={getContainer()}
              side="top"
              content={i18n.t('Notifications')}>
              <HeaderButton size="small" variant="ghost">
                <NotificationsIcon size={18} color="black" />
                <UnreadNotificationsBadge />
              </HeaderButton>
            </Tooltip>
          </div>
        </Popover>
      )}
      {!hidden.includes('settings') && (
        <Tooltip
          container={getContainer()}
          side="top"
          content={i18n.t('Settings')}>
          <HeaderButton size="small" variant="ghost" onClick={onClickSettings}>
            <SettingsIcon size={18} color="black" />
          </HeaderButton>
        </Tooltip>
      )}
      {!hidden.includes('history') && (
        <Tooltip
          container={getContainer()}
          side="top"
          content={i18n.t('Transactions History')}>
          <HeaderButton size="small" variant="ghost" onClick={onClickHistory}>
            <TransactionIcon size={18} color="black" />
          </HeaderButton>
        </Tooltip>
      )}
    </>
  );
}
