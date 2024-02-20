import type { QuoteTriggerImagesProps, QuoteTriggerProps } from './Quote.types';

import { i18n } from '@lingui/core';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Divider,
  Image,
  Tooltip,
  Typography,
} from '@rango-dev/ui';
import React, { useEffect, useState } from 'react';

import { getContainer } from '../../utils/common';
import { getUniqueBlockchains } from '../../utils/quote';

import {
  IconContainer,
  ImageContainer,
  MoreStep,
  rowStyles,
  Trigger,
} from './Quote.styles';

const MAX_STEPS = 4;
const MAX_BLOCKCHAINS = 6;
const MIN_WIDTH_WINDOW = 375;

const ImageComponent = (props: QuoteTriggerImagesProps) => {
  const tooltipContainer = getContainer();
  const { content, src, className, open, state } = props;
  return (
    <Tooltip
      container={tooltipContainer}
      side="bottom"
      sideOffset={4}
      open={open}
      content={content}>
      <ImageContainer className={className} state={state}>
        <Image src={src} size={16} />
      </ImageContainer>
    </Tooltip>
  );
};

export function QuoteTrigger(props: QuoteTriggerProps) {
  const { quoteRef, selected, setExpanded, steps, expanded, type } = props;
  const tooltipContainer = getContainer();
  const numberOfSteps = steps.length;
  const blockchains = getUniqueBlockchains(steps);
  const [isMobile, setIsMobile] = useState(false);

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < MIN_WIDTH_WINDOW) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  return (
    <Trigger
      listItem={type === 'list-item'}
      ref={(ref) => (quoteRef.current = ref)}
      selected={selected}
      onClick={(e) => {
        e.stopPropagation();
        setExpanded((prevState) => !prevState);
      }}>
      <div className={rowStyles()}>
        <Typography variant="body" size="xsmall">
          {i18n.t('Via:')}
        </Typography>
        <Divider direction="horizontal" size={4} />
        {steps.map((step, index) => {
          const key = `item-${index}`;
          const arrow = (
            <IconContainer>
              <ChevronRightIcon size={12} color="black" />
            </IconContainer>
          );

          return isMobile ? (
            <>
              <ImageComponent
                content={step.swapper.displayName}
                src={step.swapper.image}
                state={step.state}
              />
              {index !== numberOfSteps - 1 && <>{arrow}</>}
            </>
          ) : (
            <React.Fragment key={key}>
              {numberOfSteps <= MAX_STEPS ||
              (numberOfSteps > MAX_STEPS && index < MAX_STEPS - 1) ? (
                <>
                  <ImageComponent
                    content={step.swapper.displayName}
                    src={step.swapper.image}
                    state={step.state}
                  />
                  {index !== numberOfSteps - 1 && <>{arrow}</>}
                </>
              ) : (
                index === MAX_STEPS - 1 && (
                  <Tooltip
                    container={tooltipContainer}
                    side="bottom"
                    align="right"
                    sideOffset={4}
                    content={
                      <div className={rowStyles()}>
                        {arrow}
                        {steps.map((step, i) => {
                          const key = `image-${i}`;
                          return (
                            i >= index && (
                              <React.Fragment key={key}>
                                <ImageComponent
                                  content={step.swapper.displayName}
                                  src={step.swapper.image}
                                  state={step.state}
                                  open={false}
                                />
                                {i !== numberOfSteps - 1 && <>{arrow}</>}
                              </React.Fragment>
                            )
                          );
                        })}
                      </div>
                    }>
                    <MoreStep
                      state={
                        steps.find(
                          (step, i) =>
                            i >= index &&
                            (step.state === 'error' || step.state === 'warning')
                        )?.state
                      }>
                      <Typography size="xsmall" variant="body">
                        +{numberOfSteps - index}
                      </Typography>
                    </MoreStep>
                  </Tooltip>
                )
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className={rowStyles()}>
        <div className="blockchains_section">
          <div className={rowStyles()}>
            <Typography variant="body" size="xsmall">
              {i18n.t('Chains:')}
            </Typography>
            <Divider direction="horizontal" size={4} />
            {blockchains.map((blockchain, index) => (
              <>
                {blockchains.length <= MAX_BLOCKCHAINS ||
                (blockchains.length > MAX_BLOCKCHAINS &&
                  index < MAX_BLOCKCHAINS - 1) ? (
                  <ImageComponent
                    key={blockchain.displayName}
                    content={''}
                    src={blockchain.image}
                    open={false}
                    className={index !== 0 ? 'blockchainImage' : ''}
                  />
                ) : (
                  index === MAX_BLOCKCHAINS - 1 && (
                    <Tooltip
                      container={tooltipContainer}
                      side="bottom"
                      align="right"
                      sideOffset={4}
                      content={
                        <div className={rowStyles()}>
                          {blockchains.map(
                            (chain, i) =>
                              i >= index && (
                                <ImageComponent
                                  key={chain.displayName}
                                  content={''}
                                  src={chain.image}
                                  open={false}
                                  className={i > index ? 'blockchainImage' : ''}
                                />
                              )
                          )}
                        </div>
                      }>
                      <MoreStep className={'blockchainImage'}>
                        <Typography size="xsmall" variant="body">
                          +{blockchains.length - index}
                        </Typography>
                      </MoreStep>
                    </Tooltip>
                  )
                )}
              </>
            ))}

            <Divider direction="horizontal" size={32} />
          </div>
        </div>

        <IconContainer orientation={expanded ? 'up' : 'down'}>
          <ChevronDownIcon size={12} color="black" />
        </IconContainer>
      </div>
    </Trigger>
  );
}
