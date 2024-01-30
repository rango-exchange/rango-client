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
import { areTokensEqual } from '../../utils/wallets';

import { Container, Images, List } from './NotificationContent.styles';
import { NotificationNotFound } from './NotificationNotFound';

const MAX_NOTIFICATIONS_DISPLAYED = 4;

export function NotificationContent() {
  const navigate = useNavigate();

  const { getUnreadNotifications } = useNotificationStore();

  const notifications: Notification[] = getUnreadNotifications();
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();
  const sortedNotification = notifications
    .sort((a, b) => b.creationTime - a.creationTime)
    .slice(0, MAX_NOTIFICATIONS_DISPLAYED);

  const handleOnClick = (requestId: Notification['requestId']) => {
    navigate(`${navigationRoutes.swaps}/${requestId}`);
  };

  return (
    <Container>
      {sortedNotification.length ? (
        <List>
          {sortedNotification.map((notificationItem) => {
            const { route, requestId, event } = notificationItem;
            const fromToken = tokens.find((tokenItem) =>
              areTokensEqual(tokenItem, route.from)
            );

            const fromBlockchain = blockchains.find(
              (blockchainItem) => blockchainItem.name === route.from.blockchain
            );

            const toToken = tokens.find((tokenItem) =>
              areTokensEqual(tokenItem, route.to)
            );

            const toBlockchain = blockchains.find(
              (blockchainItem) => blockchainItem.name === route.to.blockchain
            );

            return (
              <ListItemButton
                key={requestId}
                onClick={() => handleOnClick(requestId)}
                title={
                  <Typography
                    variant="body"
                    size="small"
                    color={
                      event.messageSeverity === EventSeverity.WARNING
                        ? '$foreground'
                        : '$neutral700'
                    }>
                    {i18n.t(event.message)}
                  </Typography>
                }
                id={requestId}
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
