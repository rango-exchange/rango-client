import type { AlertPropTypes } from './Alert.types.js';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Divider } from '../Divider/index.js';
import { Typography } from '../Typography/index.js';

import { getColor, mapVariantToSize } from './Alert.helpers.js';
import AlertIcon from './Alert.icon.js';
import {
  Container,
  IconHighlight,
  Main,
  TitleContainer,
} from './Alert.styles.js';

export function Alert(props: PropsWithChildren<AlertPropTypes>) {
  const {
    type,
    title,
    footer,
    action,
    containerStyles,
    variant = 'regular',
    titleAlign,
    id,
  } = props;
  const isFooterString = typeof footer === 'string';

  return (
    <Container
      className="_alert"
      id={id}
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
        {action ? (
          <>
            <Divider direction="horizontal" size={'20'} />
            <div>{action}</div>
          </>
        ) : null}
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
