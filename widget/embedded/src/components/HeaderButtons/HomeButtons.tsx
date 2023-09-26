import type { HomeButtonsPropTypes } from './HeaderButtons.types';

import { i18n } from '@lingui/core';
import {
  NotificationsIcon,
  RefreshIcon,
  SettingsIcon,
  Tooltip,
  TransactionIcon,
} from '@rango-dev/ui';
import React from 'react';

import { HeaderButton } from './HeaderButtons.styles';

export function HomeButtons(props: HomeButtonsPropTypes) {
  const {
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
          <RefreshIcon size={16} color={!onClickRefresh ? 'gray' : 'black'} />
        </HeaderButton>
      </Tooltip>
      <Tooltip side="top" content={i18n.t('Notifications')}>
        <HeaderButton
          size="small"
          variant="ghost"
          onClick={onClickNotifications}>
          <NotificationsIcon size={18} color="black" />
        </HeaderButton>
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
