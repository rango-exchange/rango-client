import type { PropTypes } from './SwapListItem.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Skeleton } from '../Skeleton';
import { Typography } from '../Typography';

import { formattedDateAndTime, getStatus } from './SwapListItem.helpers';
import {
  Container,
  Date,
  Header,
  LoadingContainer,
  LoadingMain,
  Main,
} from './SwapListItem.styles';
import { StatusColors } from './SwapListItem.types';
import { SwapToken } from './SwapToken';

export function SwapListItem(props: PropsWithChildren<PropTypes>) {
  if ('isLoading' in props) {
    return (
      <LoadingMain>
        <LoadingContainer>
          <Header>
            <Skeleton variant="text" size="medium" width={76} />
            <Skeleton variant="text" size="medium" width={76} />
          </Header>
          <SwapToken isLoading={true} />
        </LoadingContainer>
      </LoadingMain>
    );
  }

  const {
    onClick,
    requestId,
    creationTime,
    onlyShowTime,
    status,
    swapTokenData,
    tooltipContainer,
  } = props;
  return (
    <Main onClick={onClick.bind(null, requestId)}>
      <Container>
        <Header>
          <Date>
            <Typography variant="label" size="medium" color="neutral600">
              {formattedDateAndTime(creationTime, onlyShowTime)}
            </Typography>
          </Date>
          <Typography
            variant="label"
            size="medium"
            color={StatusColors[status]}>
            {getStatus(status)}
          </Typography>
        </Header>
        <SwapToken
          data={swapTokenData}
          status={status}
          tooltipContainer={tooltipContainer}
        />
      </Container>
    </Main>
  );
}
