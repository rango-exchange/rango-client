import type { PropTypes } from './SwapListItem.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Typography } from '../Typography';

import { formattedDateAndTime, getStatus } from './SwapListItem.helpers';
import { Container, Header, Main } from './SwapListItem.styles';
import { StatusColors } from './SwapListItem.types';
import { SwapToken } from './SwapToken';

export function SwapListItem({
  requestId,
  creationTime,
  status,
  onClick,
  onlyShowTime,
  swapTokenData,
}: PropsWithChildren<PropTypes>) {
  return (
    <Main onClick={onClick.bind(null, requestId)}>
      <Container>
        <Header>
          <Typography variant="label" size="medium" color="neutral800">
            {formattedDateAndTime(creationTime, onlyShowTime)}
          </Typography>
          <Typography
            variant="label"
            size="medium"
            color={StatusColors[status]}>
            {getStatus(status)}
          </Typography>
        </Header>
        <SwapToken data={swapTokenData} status={status} />
      </Container>
    </Main>
  );
}
