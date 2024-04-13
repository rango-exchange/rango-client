import type { PropTypes } from './QuoteCost.types';

import React from 'react';

import { GasIcon, NumberIcon, TimeIcon } from '../../icons';
import { Divider } from '../Divider';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';

import {
  Container,
  iconStyles,
  itemStyles,
  Separator,
} from './QuoteCost.styles';

export function QuoteCost(props: PropTypes) {
  const {
    fee,
    time,
    steps,
    onClickFee,
    tooltipGas,
    feeWarning,
    tooltipContainer,
  } = props;
  return (
    <Container>
      <Tooltip
        container={tooltipContainer}
        content={tooltipGas}
        open={!onClickFee && !tooltipGas ? false : undefined}
        side="bottom">
        <div
          className={`${itemStyles()} ${onClickFee ? 'feeSection' : ''} ${
            feeWarning ? 'warning' : ''
          }`}
          onClick={onClickFee}>
          <div className={iconStyles()}>
            <GasIcon size={12} color={'gray'} />
          </div>
          <Typography align="center" variant="body" size="small">
            ${fee}
          </Typography>
          <Divider direction="horizontal" size={2} />
        </div>
      </Tooltip>

      <Separator />
      <div className={itemStyles()}>
        <div className={iconStyles()}>
          <TimeIcon size={12} color="gray" />
        </div>
        <Typography align="center" variant="body" size="small">
          {time}
        </Typography>
        <Divider direction="horizontal" size={2} />
      </div>
      {!!steps && (
        <>
          <Separator />
          <div className={itemStyles()}>
            <div className={iconStyles()}>
              <NumberIcon size={16} color="gray" />
            </div>
            <Typography align="center" variant="body" size="small">
              {steps}
            </Typography>
            <Divider direction="horizontal" size={2} />
          </div>
        </>
      )}
    </Container>
  );
}
