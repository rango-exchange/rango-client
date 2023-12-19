import type { PropTypes } from './QuoteCost.types';

import React from 'react';

import { GasIcon, NumberIcon, TimeIcon } from '../../icons';
import { Typography } from '../Typography';

import {
  Container,
  iconStyles,
  itemStyles,
  Separator,
} from './QuoteCost.styles';

export function QuoteCost(props: PropTypes) {
  const { fee, time, steps } = props;
  return (
    <Container>
      <div className={itemStyles()}>
        <div className={iconStyles()}>
          <GasIcon size={12} color={'gray'} />
        </div>
        <Typography ml={2} align="center" variant="body" size="small">
          ${fee}
        </Typography>
      </div>
      <Separator />
      <div className={itemStyles()}>
        <div className={iconStyles()}>
          <TimeIcon size={12} color="gray" />
        </div>
        <Typography ml={2} align="center" variant="body" size="small">
          {time}
        </Typography>
      </div>
      <Separator />
      <div className={itemStyles()}>
        <div className={iconStyles()}>
          <NumberIcon size={16} color="gray" />
        </div>
        <Typography ml={2} align="center" variant="body" size="small">
          {steps}
        </Typography>
      </div>
    </Container>
  );
}
