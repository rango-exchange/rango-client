import type { QuoteTriggerImagesProps, QuoteTriggerProps } from './Quote.types';

import { i18n } from '@lingui/core';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Divider,
  Image,
  Tooltip,
  Typography,
} from '@arlert-dev/ui';
import React from 'react';

import useScreenDetect from '../../hooks/useScreenDetect';
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

const ImageComponent = (props: QuoteTriggerImagesProps) => {
  const { content, src, className, open, state, container } = props;
  const tooltipContainer = container || getContainer();
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
  const { quoteRef, selected, setExpanded, steps, expanded, type, container } =
    props;
  const tooltipContainer = container || getContainer();
  const numberOfSteps = steps.length;
  const blockchains = getUniqueBlockchains(steps);
  const { isTablet, isMobile } = useScreenDetect();

  return (
    <Trigger
      className="widget-quote-trigger-btn"
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

          return isMobile || isTablet ? (
            <React.Fragment key={key}>
              <ImageComponent
                content={step.swapper.displayName}
                src={step.swapper.image ?? ''}
                state={step.state}
                container={container}
              />
              {index !== numberOfSteps - 1 && <>{arrow}</>}
            </React.Fragment>
          ) : (
            <React.Fragment key={key}>
              {numberOfSteps <= MAX_STEPS ||
              (numberOfSteps > MAX_STEPS && index < MAX_STEPS - 1) ? (
                <>
                  <ImageComponent
                    content={step.swapper.displayName}
                    src={step.swapper.image ?? ''}
                    state={step.state}
                    container={container}
                  />
                  {index !== numberOfSteps - 1 && <>{arrow}</>}
                </>
              ) : (
                index === MAX_STEPS - 1 && (
                  <Tooltip
                    container={tooltipContainer}
                    side="bottom"
                    align="end"
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
                                  src={step.swapper.image ?? ''}
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
              <React.Fragment key={blockchain.displayName}>
                {blockchains.length <= MAX_BLOCKCHAINS ||
                (blockchains.length > MAX_BLOCKCHAINS &&
                  index < MAX_BLOCKCHAINS - 1) ? (
                  <Tooltip
                    container={tooltipContainer}
                    side="bottom"
                    content={blockchain.displayName}
                    sideOffset={4}>
                    <ImageComponent
                      content={''}
                      src={blockchain.image ?? ''}
                      open={false}
                      className={index !== 0 ? 'blockchainImage' : ''}
                    />
                  </Tooltip>
                ) : (
                  index === MAX_BLOCKCHAINS - 1 && (
                    <Tooltip
                      container={tooltipContainer}
                      side="bottom"
                      align="end"
                      sideOffset={4}
                      content={
                        <div className={rowStyles()}>
                          {blockchains.map(
                            (chain, i) =>
                              i >= index && (
                                <ImageComponent
                                  key={chain.displayName}
                                  content={''}
                                  src={chain.image ?? ''}
                                  open={false}
                                  className={i > index ? 'blockchainImage' : ''}
                                  container={container}
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
              </React.Fragment>
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
