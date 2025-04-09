import type { SwapListItemPropTypes } from './SwapListItem.types.js';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Skeleton } from '../Skeleton/index.js';
import { Typography } from '../Typography/index.js';

import { formattedDateAndTime, getStatus } from './SwapListItem.helpers.js';
import {
  Container,
  Date,
  Header,
  LoadingContainer,
  LoadingMain,
  Main,
} from './SwapListItem.styles.js';
import { StatusColors } from './SwapListItem.types.js';
import { SwapToken } from './SwapToken.js';

export function SwapListItem(props: PropsWithChildren<SwapListItemPropTypes>) {
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
    currentStep,
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
          currentStep={currentStep}
        />
      </Container>
    </Main>
  );
}
