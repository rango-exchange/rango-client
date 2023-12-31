import type { BlockchainsProps } from './Quote.types';
import type { ReactNode } from 'react';

import {
  ChevronDownIcon,
  ChevronRightIcon,
  Image,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React from 'react';

import { getContainer } from '../../utils/common';

import {
  ChainImageContainer,
  Chains,
  IconContainer,
  MoreStep,
  TooltipContent,
} from './Quote.styles';

const MAX_STEPS = 4;
const INDEX_OF_STEP = 3;

const ChainImage = (props: {
  content: ReactNode;
  state?: 'error' | 'warning' | undefined;
  src: string;
  open?: boolean;
  className?: string;
}) => {
  const tooltipContainer = getContainer();

  return (
    <Tooltip
      container={tooltipContainer}
      side="bottom"
      sideOffset={4}
      open={props.open}
      content={props.content}>
      <ChainImageContainer className={props.className} state={props.state}>
        <Image src={props.src} size={16} />
      </ChainImageContainer>
    </Tooltip>
  );
};

export function BlockchainsComponent(props: BlockchainsProps) {
  const { quoteRef, recommended, setExpanded, steps, numberOfSteps, expanded } =
    props;
  const tooltipContainer = getContainer();

  return (
    <Chains
      ref={(ref) => (quoteRef.current = ref)}
      recommended={recommended}
      onClick={() => setExpanded((prevState) => !prevState)}>
      <div>
        {steps.map((step, index) => {
          const key = `item-${index}`;
          const arrow = (
            <IconContainer>
              <ChevronRightIcon
                size={12}
                color="black"
                {...(step.state && {
                  color: step.state === 'error' ? 'error' : 'warning',
                })}
              />
            </IconContainer>
          );

          return (
            <React.Fragment key={key}>
              {numberOfSteps < MAX_STEPS ||
              (numberOfSteps >= MAX_STEPS && index < INDEX_OF_STEP) ? (
                <>
                  <ChainImage
                    content={step.from.chain.displayName}
                    src={step.from.chain.image}
                    state={step.state || steps[index - 1]?.state}
                  />

                  {index === numberOfSteps - 1 && (
                    <>
                      {arrow}
                      <ChainImage
                        content={step.to.chain.displayName}
                        src={step.to.chain.image}
                        state={step.state}
                      />
                    </>
                  )}
                  {index !== numberOfSteps - 1 && <>{arrow}</>}
                </>
              ) : (
                index === INDEX_OF_STEP && (
                  <Tooltip
                    container={tooltipContainer}
                    side="bottom"
                    sideOffset={4}
                    content={
                      <TooltipContent>
                        {steps.map((step, i) => {
                          const key = `image-${i}`;
                          return (
                            <>
                              {i >= index && (
                                <ChainImage
                                  key={key}
                                  content={''}
                                  src={step.from.chain.image}
                                  state={step.state || steps[index - 1]?.state}
                                  open={false}
                                  className={i !== index ? 'chainImage' : ''}
                                />
                              )}
                              {i === numberOfSteps - 1 && (
                                <ChainImage
                                  key={key}
                                  content={''}
                                  src={step.to.chain.image}
                                  state={step.state}
                                  open={false}
                                  className="chainImage"
                                />
                              )}
                            </>
                          );
                        })}
                      </TooltipContent>
                    }>
                    <MoreStep>
                      <Typography size="xsmall" variant="body">
                        +{numberOfSteps - index + 1}
                      </Typography>
                    </MoreStep>
                  </Tooltip>
                )
              )}
            </React.Fragment>
          );
        })}
      </div>

      <IconContainer orientation={expanded ? 'up' : 'down'}>
        <ChevronDownIcon size={12} color="black" />
      </IconContainer>
    </Chains>
  );
}
