import type { PropTypes } from './Alert.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Divider } from '../Divider';
import { Typography } from '../Typography';

import { getColor } from './Alert.helpers';
import { Container, IconHighlight, Main, TitleContainer } from './Alert.styles';
import AlertIcon from './AlertIcon';

enum TitleSize {
  regular = 'xsmall',
  alarm = 'small',
}

export function Alert(props: PropsWithChildren<PropTypes>) {
  const {
    type,
    title,
    footer,
    action,
    containerStyles,
    variant = 'regular',
    titleContainerStyles,
    titleSize,
    titleColor,
  } = props;
  const isFooterString = typeof footer === 'string';

  return (
    <Container css={containerStyles} type={type} variant={variant}>
      <Main variant={variant}>
        <TitleContainer css={titleContainerStyles}>
          <IconHighlight type={type}>
            <AlertIcon type={type} />
          </IconHighlight>
          <Divider direction="horizontal" size={4} />
          {title && (
            <Typography
              color={titleColor || getColor(type, variant)}
              variant="body"
              size={titleSize || TitleSize[variant]}>
              {title}
            </Typography>
          )}
        </TitleContainer>
        {action ? <div>{action}</div> : null}
      </Main>
      {footer ? (
        <div className={`footer ${isFooterString ? 'description' : ''}`}>
          {footer}
        </div>
      ) : null}
    </Container>
  );
}

Alert.toString = () => '._alert';
