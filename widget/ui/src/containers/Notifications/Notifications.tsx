import type { PropTypes } from './Notifications.types.js';

import { i18n } from '@lingui/core';
import React from 'react';

import { ChainToken, Divider, Typography } from '../../components/index.js';
import { ChevronRightIcon } from '../../icons/index.js';

import { NotificationNotFound } from './NotificationNotFound.js';
import {
  ClearAllButton,
  Container,
  Header,
  IconContainer,
  Images,
  List,
  ListItem,
} from './Notifications.styles.js';

export function Notifications(props: PropTypes) {
  const {
    list,
    getBlockchainImage,
    getTokenImage,
    onClickItem,
    onClearAll,
    containerStyles,
    id,
  } = props;
  return (
    <Container equalPadding={list.length === 0} css={containerStyles}>
      {list.length > 0 && (
        <>
          <Header>
            <Typography variant="label" size="medium">
              {i18n.t('Notifications')}
            </Typography>
            <ClearAllButton
              id={`${id}-clear-all-btn`}
              variant="ghost"
              size="xsmall"
              onClick={onClearAll}>
              <Typography variant="body" size="xsmall" color="neutral700">
                {i18n.t('Clear all')}
              </Typography>
            </ClearAllButton>
          </Header>
          <Divider direction="vertical" size={4} />
        </>
      )}
      {list.length ? (
        <List>
          {list.map((notificationItem, index) => {
            const { route, requestId, event } = notificationItem;
            const fromTokenImage = getTokenImage(route.from);

            const fromBlockchainImage = getBlockchainImage(
              route.from.blockchain
            );

            const toTokenImage = getTokenImage(route.to);

            const toBlockchainImage = getBlockchainImage(route.to.blockchain);

            return (
              <React.Fragment key={requestId}>
                {index > 0 && <Divider size={4} />}
                <ListItem
                  className={`${id}-list-item`}
                  onClick={() => onClickItem(requestId)}
                  actionRequired={event.messageSeverity === 'warning'}
                  title={
                    <Typography
                      variant="body"
                      size="small"
                      color={
                        event.messageSeverity === 'warning'
                          ? '$foreground'
                          : '$neutral700'
                      }>
                      {i18n.t(event.message)}
                    </Typography>
                  }
                  id={requestId}
                  start={
                    <Images>
                      <ChainToken
                        tokenImage={fromTokenImage}
                        chainImage={fromBlockchainImage}
                        size="small"
                      />
                      <ChainToken
                        tokenImage={toTokenImage}
                        chainImage={toBlockchainImage}
                        size="small"
                      />
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
