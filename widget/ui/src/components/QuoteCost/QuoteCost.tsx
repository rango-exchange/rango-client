import type { PropTypes } from './QuoteCost.types.js';

import React from 'react';

import { GasIcon, NumberIcon, TimeIcon } from '../../icons/index.js';
import { Divider } from '../Divider/index.js';
import { Tooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  Container,
  iconStyles,
  itemStyles,
  Separator,
} from './QuoteCost.styles.js';

export function QuoteCost(props: PropTypes) {
  const {
    fee,
    time,
    steps,
    onClickFee,
    tooltipGas,
    feeWarning,
    timeWarning,
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
          <Divider direction="horizontal" size={2} />
          <Typography align="center" variant="body" size="small">
            ${fee}
          </Typography>
        </div>
      </Tooltip>

      <Separator />
      <div className={`${itemStyles()} ${timeWarning ? 'warning' : ''}`}>
        <div className={iconStyles()}>
          <TimeIcon size={12} color="gray" />
        </div>
        <Divider direction="horizontal" size={2} />
        <Typography align="center" variant="body" size="small">
          {time}
        </Typography>
      </div>
      {!!steps && (
        <>
          <Separator />
          <div className={itemStyles()}>
            <div className={iconStyles()}>
              <NumberIcon size={16} color="gray" />
            </div>
            <Divider direction="horizontal" size={2} />
            <Typography align="center" variant="body" size="small">
              {steps}
            </Typography>
          </div>
        </>
      )}
    </Container>
  );
}
