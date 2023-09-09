import type { BestRouteProps } from './BestRoute.types';

import React, { useState } from 'react';

import { Typography } from '../../components/Typography';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  GasIcon,
  InfoIcon,
  NumberIcon,
  TimeIcon,
} from '../../icons';
import { Image } from '../common';
import { Divider } from '../Divider';
import { StepDetails } from '../StepDetails';
import { TokenAmount } from '../TokenAmount/TokenAmount';
import { Tooltip } from '../Tooltip';

import {
  Chains,
  Content,
  FrameIcon,
  HorizontalSeparator,
  IconContainer,
  RouteContainer,
  Separator,
  SummaryContainer,
} from './BestRoute.styles';

export function BestRoute(props: BestRouteProps) {
  const {
    steps,
    totalFee,
    totalTime,
    tag,
    input,
    output,
    percentageChange,
    warningLevel,
    type,
    recommended = true,
  } = props;

  const numberOfSteps = steps.length;

  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <SummaryContainer recommended={recommended} basic={type === 'basic'}>
        <div className="summary">
          <div className="cost-and-time">
            <div className="cost-and-time__item">
              <div className="icon">
                <GasIcon size={12} color={'gray'} />
              </div>
              <Typography ml={2} align="center" variant="body" size="small">
                {`$${totalFee}`}
              </Typography>
            </div>
            <Separator />
            <div className="cost-and-time__item">
              <div className="icon">
                <TimeIcon size={12} color="gray" />
              </div>
              <Typography ml={2} align="center" variant="body" size="small">
                {`${totalTime} min`}
              </Typography>
            </div>
            <Separator />
            <div className="cost-and-time__item">
              <div className="icon">
                <NumberIcon size={16} color="gray" />
              </div>
              <Typography ml={2} align="center" variant="body" size="small">
                {numberOfSteps}
              </Typography>
            </div>
            {tag}
          </div>

          {type === 'basic' && (
            <div className="basic-info">
              <FrameIcon>
                <InfoIcon size={12} color="gray" />
              </FrameIcon>
              <Typography
                size="small"
                variant="body"
                style={{ letterSpacing: 0.4 }}>
                {`${input.value} ${steps[0].from.token.displayName} = ${
                  output.value
                } ${steps[steps.length - 1].to.token.displayName}`}
              </Typography>
              <Typography
                color="$neutral800"
                ml={2}
                size="xsmall"
                variant="body">
                {`($${output.usdValue})`}
              </Typography>
            </div>
          )}
          {type === 'list-item' && (
            <TokenAmount
              type="output"
              direction="vertical"
              price={{ value: output.value, usdValue: output.usdValue }}
              token={{
                displayName: steps[numberOfSteps - 1].to.token.displayName,
                image: steps[numberOfSteps - 1].to.token.image,
              }}
              chain={{ image: steps[numberOfSteps - 1].to.chain.image }}
              percentageChange={percentageChange}
              warningLevel={warningLevel}
            />
          )}
          {type === 'swap-preview' && (
            <>
              <Divider size={4} />
              <TokenAmount
                type="input"
                price={{ value: input.value, usdValue: input.usdValue }}
                token={{
                  displayName: steps[0].from.token.displayName,
                  image: steps[0].from.token.image,
                }}
                chain={{ image: steps[0].from.chain.image }}
              />
              <Separator css={{ height: '$16', marginLeft: '14px' }} />
              <TokenAmount
                type="output"
                price={{ value: output.value, usdValue: output.usdValue }}
                token={{
                  displayName: steps[numberOfSteps - 1].to.token.displayName,
                  image: steps[numberOfSteps - 1].to.token.image,
                }}
                chain={{ image: steps[numberOfSteps - 1].to.chain.image }}
                percentageChange={percentageChange}
                warningLevel={warningLevel}
              />
              <Divider size={4} />
            </>
          )}
        </div>
      </SummaryContainer>
      <RouteContainer
        recommended={recommended}
        open={expanded}
        onOpenChange={setExpanded}>
        <Chains
          recommended={recommended}
          onClick={setExpanded.bind(null, (prevState) => !prevState)}>
          <div>
            {steps.map((step, index) => {
              const key = `item-${index}`;
              return (
                <React.Fragment key={key}>
                  <Tooltip content={step.from.chain.displayName}>
                    <Image src={step.from.chain.image} size={16} />
                  </Tooltip>
                  {index === numberOfSteps - 1 && (
                    <>
                      <IconContainer>
                        <ChevronRightIcon size={12} color="black" />
                      </IconContainer>
                      <Tooltip content={step.to.chain.displayName}>
                        <Image src={step.to.chain.image} size={16} />
                      </Tooltip>
                    </>
                  )}
                  {index !== numberOfSteps - 1 && (
                    <IconContainer>
                      <ChevronRightIcon size={12} color="black" />
                    </IconContainer>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <IconContainer orientation={expanded ? 'up' : 'down'}>
            <ChevronDownIcon size={12} color="black" />
          </IconContainer>
        </Chains>
        <Content open={expanded}>
          <HorizontalSeparator />
          <div className="steps-details">
            {steps.map((step, index) => {
              const key = `item-${index}`;
              return (
                <StepDetails
                  type="route-details"
                  key={key}
                  step={step}
                  hasSeparator={index !== steps.length - 1}
                />
              );
            })}
          </div>
        </Content>
      </RouteContainer>
    </>
  );
}
