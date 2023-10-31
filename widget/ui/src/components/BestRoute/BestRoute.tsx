import type { BestRouteProps } from './BestRoute.types';

import React, { useLayoutEffect, useRef, useState } from 'react';

import { Typography } from '../../components/Typography';
import { ChevronDownIcon, ChevronRightIcon, InfoIcon } from '../../icons';
import { Image } from '../common';
import { Divider } from '../Divider';
import { RouteCost } from '../RouteCost';
import { StepDetails } from '../StepDetails';
import { TokenAmount } from '../TokenAmount/TokenAmount';
import { Tooltip } from '../Tooltip';

import {
  Chains,
  Content,
  EXPANDABLE_ROUTES_TRANSITION_DURATION,
  FrameIcon,
  HorizontalSeparator,
  IconContainer,
  RouteContainer,
  SummaryContainer,
} from './BestRoute.styles';
import { RouteSummary } from './RouteSummary';

export function BestRoute(props: BestRouteProps) {
  const {
    steps,
    totalFee,
    totalTime,
    input,
    output,
    percentageChange,
    warningLevel,
    type,
    recommended = true,
  } = props;

  const numberOfSteps = steps.length;

  const [expanded, setExpanded] = useState(props.expanded);
  const routeRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    if (expanded && routeRef.current) {
      setTimeout(() => {
        routeRef?.current?.scrollIntoView({ behavior: 'smooth' });
      }, EXPANDABLE_ROUTES_TRANSITION_DURATION);
    }
  }, [expanded]);

  return (
    <>
      <SummaryContainer
        recommended={recommended}
        listItem={type === 'list-item'}
        basic={type === 'basic'}>
        <div className="summary">
          <RouteCost fee={totalFee} time={totalTime} steps={numberOfSteps} />
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
                color="$neutral600"
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
              <RouteSummary
                from={steps[0].from}
                to={steps[numberOfSteps - 1].to}
                percentageChange={percentageChange}
                warningLevel={warningLevel}
              />
              <Divider size={4} />
            </>
          )}
        </div>
        <RouteContainer
          recommended={recommended}
          open={expanded}
          onOpenChange={setExpanded}>
          <Chains
            ref={(ref) => (routeRef.current = ref)}
            recommended={recommended}
            onClick={setExpanded.bind(null, (prevState) => !prevState)}>
            <div>
              {steps.map((step, index) => {
                const key = `item-${index}`;
                return (
                  <React.Fragment key={key}>
                    <Tooltip
                      container={props.tooltipContainer}
                      side="bottom"
                      sideOffset={4}
                      content={step.from.chain.displayName}>
                      <Image src={step.from.chain.image} size={16} />
                    </Tooltip>
                    {index === numberOfSteps - 1 && (
                      <>
                        <IconContainer>
                          <ChevronRightIcon size={12} color="black" />
                        </IconContainer>
                        <Tooltip
                          container={props.tooltipContainer}
                          side="bottom"
                          sideOffset={4}
                          content={step.to.chain.displayName}>
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
                    state={step.alerts ? 'error' : undefined}
                  />
                );
              })}
            </div>
          </Content>
        </RouteContainer>
      </SummaryContainer>
    </>
  );
}
