import type { PropTypes } from './RouteCost.types';

import { i18n } from '@lingui/core';
import React from 'react';

import { GasIcon, NumberIcon, TimeIcon } from '../../icons';
import { Separator } from '../BestRoute/BestRoute.styles';
import { Typography } from '../Typography';

import { Container } from './RouteCost.styles';

export function RouteCost(props: PropTypes) {
  const { fee, time, steps } = props;
  return (
    <Container>
      <div className="item">
        <div className="icon">
          <GasIcon size={12} color={'gray'} />
        </div>
        <Typography ml={2} align="center" variant="body" size="small">
          ${fee}
        </Typography>
      </div>
      <Separator />
      <div className="item">
        <div className="icon">
          <TimeIcon size={12} color="gray" />
        </div>
        <Typography ml={2} align="center" variant="body" size="small">
          {i18n.t({
            id: 'timeSec',
            message: '{time} sec',
            values: { time },
          })}
        </Typography>
      </div>
      <Separator />
      <div className="item">
        <div className="icon">
          <NumberIcon size={16} color="gray" />
        </div>
        <Typography ml={2} align="center" variant="body" size="small">
          {steps}
        </Typography>
      </div>
    </Container>
  );
}
