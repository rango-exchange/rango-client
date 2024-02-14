import type { PropTypes } from './Alert.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Divider } from '../Divider';
import { Typography } from '../Typography';

import { getColor, mapVariantToSize } from './Alert.helpers';
import { Container, IconHighlight, Main, TitleContainer } from './Alert.styles';
import AlertIcon from './AlertIcon';

export function Alert(props: PropsWithChildren<PropTypes>) {
  const {
    type,
    title,
    footer,
    action,
    containerStyles,
    variant = 'regular',
    titleAlign,
  } = props;
  const isFooterString = typeof footer === 'string';

  return (
    <Container
      className="_alert"
      css={containerStyles}
      type={type}
      variant={variant}>
      <Main variant={variant}>
        <TitleContainer>
          <IconHighlight type={type}>
            <AlertIcon type={type} />
          </IconHighlight>
          <Divider direction="horizontal" size={4} />
          {title && (
            <Typography
              color={getColor(type, variant)}
              align={titleAlign}
              variant="body"
              className="title_typography"
              size={mapVariantToSize(variant)}>
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
