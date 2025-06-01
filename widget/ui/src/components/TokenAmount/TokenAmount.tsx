import type { PropTypes } from './TokenAmount.types.js';

import React from 'react';

import { ChainToken } from '../ChainToken/index.js';
import { Divider } from '../Divider/index.js';
import { PriceImpact } from '../PriceImpact/index.js';
import { ValueTypography } from '../PriceImpact/PriceImpact.styles.js';
import { NumericTooltip } from '../Tooltip/index.js';
import { Typography } from '../Typography/index.js';

import {
  Container,
  tokenAmountStyles,
  tooltipRootStyle,
  usdValueStyles,
} from './TokenAmount.styles.js';

export function TokenAmount(props: PropTypes) {
  return (
    <Container
      direction={props.direction}
      centerAlign={props.centerAlign}
      id={props.id}>
      <div className={tokenAmountStyles()}>
        <ChainToken
          chainImage={props.chain.image}
          tokenImage={props.token.image}
          size="medium"
        />

        <Divider direction="horizontal" size={4} />
        <div>
          {props.label && (
            <Typography size="xsmall" variant="body" color="$neutral700">
              {props.label}
            </Typography>
          )}
          <div>
            <NumericTooltip
              styles={{ root: tooltipRootStyle }}
              content={props.price.realValue}
              open={!props.price.realValue ? false : undefined}
              container={props.tooltipContainer}>
              <Typography
                size="medium"
                variant="title"
                style={{ fontWeight: 600 }}>
                {props.price.value}
              </Typography>
              <Divider direction="horizontal" size={8} />
              <Typography
                size="medium"
                variant="title"
                style={{ fontWeight: 400 }}>
                {props.token.displayName}
              </Typography>
            </NumericTooltip>
          </div>
        </div>
      </div>
      {props.price.usdValue && props.price.usdValue !== '0' && (
        <div className={usdValueStyles()}>
          <NumericTooltip
            content={props.price.realUsdValue}
            container={props.tooltipContainer}>
            {props.type === 'input' && (
              <ValueTypography>
                <Typography size="small" variant="body">
                  {`~$${props.price.usdValue}`}
                </Typography>
              </ValueTypography>
            )}
          </NumericTooltip>
          {props.type === 'output' && (
            <PriceImpact
              size="small"
              tooltipProps={{ container: props.tooltipContainer, side: 'top' }}
              outputUsdValue={props.price.usdValue}
              percentageChange={props.percentageChange}
              warningLevel={props.warningLevel}
              realOutputUsdValue={props.price.realUsdValue}
            />
          )}
        </div>
      )}
    </Container>
  );
}
