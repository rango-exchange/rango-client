import type { PropTypes } from './TokenAmount.types';

import React from 'react';

import { ChainToken } from '../ChainToken';
import { Divider } from '../Divider';
import { PriceImpact } from '../PriceImpact';
import { ValueTypography } from '../PriceImpact/PriceImpact.styles';
import { NumericTooltip } from '../Tooltip';
import { Typography } from '../Typography';

import {
  Container,
  tokenAmountStyles,
  tooltipRootStyle,
  usdValueStyles,
} from './TokenAmount.styles';

export function TokenAmount(props: PropTypes) {
  return (
    <Container direction={props.direction} centerAlign={props.centerAlign}>
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
