import type { Notification } from '../../types/notification';

import { i18n } from '@lingui/core';
import { EventSeverity } from '@rango-dev/queue-manager-rango-preset';
import {
  ChainToken,
  ChevronRightIcon,
  Divider,
  Typography,
} from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { useAppStore } from '../../store/AppStore';
import { useNotificationStore } from '../../store/notification';

import {
  ClearAllButton,
  Container,
  Header,
  IconContainer,
  Images,
  List,
  ListItem,
} from './NotificationContent.styles';
import { NotificationNotFound } from './NotificationNotFound';

const MAX_NOTIFICATIONS_DISPLAYED = 4;

export function NotificationContent() {
  const navigate = useNavigate();

  const { getNotifications, clearNotifications } = useNotificationStore();

  const notifications: Notification[] = getNotifications();
  const blockchains = useAppStore().blockchains();
  const { findToken } = useAppStore();
  const sortedNotification = notifications
    .sort((a, b) => b.creationTime - a.creationTime)
    .slice(0, MAX_NOTIFICATIONS_DISPLAYED);

  const handleOnClick = (requestId: Notification['requestId']) => {
    navigate(`${navigationRoutes.swaps}/${requestId}`);
  };

  return (
    <Container>
      {sortedNotification.length > 0 && (
        <>
          <Header>
            <Typography variant="label" size="medium">
              {i18n.t('Notifications')}
            </Typography>
            <ClearAllButton
              variant="ghost"
              size="xsmall"
              onClick={clearNotifications}>
              <Typography variant="body" size="xsmall">
                {i18n.t('Clear all')}
              </Typography>
            </ClearAllButton>
          </Header>
          <Divider direction="vertical" size={4} />
        </>
      )}
      {sortedNotification.length ? (
        <List>
          {sortedNotification.map((notificationItem, index) => {
            const { route, requestId, event } = notificationItem;
            const fromToken = findToken(route.from);

            const fromBlockchain = blockchains.find(
              (blockchainItem) => blockchainItem.name === route.from.blockchain
            );

            const toToken = findToken(route.to);

            const toBlockchain = blockchains.find(
              (blockchainItem) => blockchainItem.name === route.to.blockchain
            );

            return (
              <React.Fragment key={requestId}>
                {index > 0 && <Divider size={4} />}
                <ListItem
                  onClick={() => handleOnClick(requestId)}
                  actionRequired={
                    event.messageSeverity === EventSeverity.WARNING
                  }
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
                  end={
                    <IconContainer>
                      <ChevronRightIcon size={12} color="gray" />
                    </IconContainer>
                  }
                />
              </React.Fragment>
            );
          })}
        </List>
      ) : (
        <NotificationNotFound />
      )}
    </Container>
  );
}
