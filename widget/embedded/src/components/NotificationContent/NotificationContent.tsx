import type { Notification } from '../../types/notification';

import { i18n } from '@lingui/core';
import { EventSeverity } from '@rango-dev/queue-manager-rango-preset';
import {
  ChainToken,
  ChevronRightIcon,
  ListItemButton,
  Typography,
} from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';
import { useUiStore } from '../../store/ui';

import { Container, Images, List } from './NotificationContent.styles';
import { NotificationNotFound } from './NotificationNotFound';

const MAX_NOTIFICATIONS_DISPLAYED = 4;

export function NotificationContent() {
  const navigate = useNavigate();
  const setSelectedSwap = useUiStore.use.setSelectedSwap();

  const { getUnreadNotifications } = useNotificationStore();

  const notifications: Notification[] = getUnreadNotifications();
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();
  const sortedNotification = notifications
    .sort((a, b) => b.creationTime - a.creationTime)
    .slice(0, MAX_NOTIFICATIONS_DISPLAYED);

  const handleOnClick = (requestId: Notification['requestId']) => {
    setSelectedSwap(requestId);
    navigate(`${navigationRoutes.swaps}/${requestId}`);
  };

  return (
    <Container>
      {sortedNotification.length ? (
        <List>
          {sortedNotification.map((notificationItem) => {
            const fromToken = tokens.find(
              (tokenItem) =>
                tokenItem.address ===
                  notificationItem.route.from.tokenAddress &&
                tokenItem.blockchain ===
                  notificationItem.route.from.blockchain &&
                tokenItem.symbol === notificationItem.route.from.tokenSymbol
            );

            const fromBlockchain = blockchains.find(
              (blockchainItem) =>
                blockchainItem.name === notificationItem.route.from.blockchain
            );

            const toToken = tokens.find(
              (tokenItem) =>
                tokenItem.address === notificationItem.route.to.tokenAddress &&
                tokenItem.blockchain === notificationItem.route.to.blockchain &&
                tokenItem.symbol === notificationItem.route.to.tokenSymbol
            );

            const toBlockchain = blockchains.find(
              (blockchainItem) =>
                blockchainItem.name === notificationItem.route.to.blockchain
            );

            return (
              <ListItemButton
                key={notificationItem.requestId}
                onClick={() => handleOnClick(notificationItem.requestId)}
                title={
                  <Typography
                    variant="body"
                    size="small"
                    color={
                      notificationItem.event.messageSeverity ===
                      EventSeverity.WARNING
                        ? '$foreground'
                        : '$neutral700'
                    }>
                    {i18n.t(notificationItem.event.message)}
                  </Typography>
                }
                id={notificationItem.requestId}
                start={
                  <Images>
                    <div className="from-chain-token">
                      <ChainToken
                        tokenImage={fromToken ? fromToken.image : ''}
                        chainImage={fromBlockchain ? fromBlockchain.logo : ''}
                        size="small"
                      />
                    </div>
                    <div className="to-chain-token">
                      <ChainToken
                        tokenImage={toToken ? toToken.image : ''}
                        chainImage={toBlockchain ? toBlockchain.logo : ''}
                        size="small"
                      />
                    </div>
                  </Images>
                }
                end={<ChevronRightIcon size={12} color="gray" />}
              />
            );
          })}
        </List>
      ) : (
        <NotificationNotFound />
      )}
    </Container>
  );
}
