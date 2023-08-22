import type { StepDetailsProps } from './StepDetails.types';

import React from 'react';

import { ChainToken } from '../../components/ChainToken/ChainToken';
import { NextIcon } from '../../icons';
import { Image } from '../common';
import { Divider } from '../Divider';
import { Typography } from '../Typography';

import {
  Alerts,
  Container,
  DashedLine,
  StepSeparator,
  SwapperImage,
} from './StepDetails.styles';

export function StepDetails(props: StepDetailsProps) {
  const { step, hasSeparator, type, state } = props;
  return (
    <Container type={type} state={state}>
      <div className="swapper">
        {type === 'route-progress' && hasSeparator && (
          <StepSeparator state={state} />
        )}
        <SwapperImage state={state}>
          <Image size={22} src={step.swapper.image} />
        </SwapperImage>
        <Typography
          className="swapper__description"
          ml={8}
          size="small"
          variant="body">{`Swap on ${step.from.chain.displayName} via ${step.swapper.displayName}`}</Typography>
      </div>
      <div className="step-info">
        <DashedLine invisible={!hasSeparator || type === 'route-progress'} />
        <div className="tokens-container">
          <div className="tokens">
            <ChainToken
              chainImage={step.from.chain.image}
              tokenImage={step.from.token.image}
              size="small"
            />
            <Typography
              ml={4}
              mr={4}
              size="small"
              color="$neutral600"
              variant="body">{`${step.from.price.value} ${step.from.token.displayName}`}</Typography>
            <NextIcon color="gray" />
            <Divider size={4} direction="horizontal" />
            <ChainToken
              chainImage={step.to.chain.image}
              tokenImage={step.to.token.image}
              size="small"
            />
            <Typography
              ml={4}
              size="small"
              color="$neutral600"
              variant="body">{`${step.to.price.value} ${step.to.token.displayName}`}</Typography>
          </div>
          <Alerts pb={!hasSeparator && type === 'route-details'}>
            {step.alerts}
          </Alerts>
        </div>
      </div>
    </Container>
  );
}
