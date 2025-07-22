import type { HeaderButtonsPropTypes } from './HeaderButtons.types';

import { i18n } from '@lingui/core';
import {
  NotificationsIcon,
  Popover,
  SettingsIcon,
  Tooltip,
  TransactionIcon,
} from '@arlert-dev/ui';
import React from 'react';

import { useAppStore } from '../../store/AppStore';
import { getContainer } from '../../utils/common';
import { isFeatureHidden } from '../../utils/settings';
import { NotificationContent } from '../NotificationContent';

import { HeaderButton } from './HeaderButtons.styles';
import InProgressTransactionBadge from './InProgressTransactionBadge';
import { NotificationsBadge } from './NotificationsBadge';
import { RefreshButton } from './RefreshButton';

export function HeaderButtons(props: HeaderButtonsPropTypes) {
  const {
    onClickRefresh,
    onClickHistory,
    onClickSettings,
    hidden = [],
    container,
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
          container={container || getContainer()}
          side="top"
          content={i18n.t('Refresh')}>
          <RefreshButton onClick={onClickRefresh} />
        </Tooltip>
      )}

      {!isNotificationsHidden && (
        <Popover
          align="end"
          alignOffset={-88}
          sideOffset={15}
          collisionPadding={{ right: 20, left: 20 }}
          container={getContainer()}
          content={<NotificationContent />}>
          <div>
            <Tooltip
              container={getContainer()}
              side="top"
              content={i18n.t('Notifications')}>
              <HeaderButton
                id="widget-header-notification-icon-btn"
                size="small"
                variant="ghost">
                <NotificationsIcon size={18} color="black" />
                <NotificationsBadge />
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
          <HeaderButton
            id="widget-header-setting-icon-btn"
            size="small"
            variant="ghost"
            onClick={onClickSettings}>
            <SettingsIcon size={18} color="black" />
          </HeaderButton>
        </Tooltip>
      )}
      {!hidden.includes('history') && (
        <Tooltip
          container={getContainer()}
          side="top"
          content={i18n.t('History')}>
          <HeaderButton
            id="widget-header-history-icon-btn"
            size="small"
            variant="ghost"
            onClick={onClickHistory}>
            <TransactionIcon size={18} color="black" />
            <InProgressTransactionBadge />
          </HeaderButton>
        </Tooltip>
      )}
    </>
  );
}
