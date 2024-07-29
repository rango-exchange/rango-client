import type { PropTypes } from './Header.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Typography } from '../Typography';

import { Container, globalHeaderStyles, Prefix, Suffix } from './Header.styles';

export function Header({
  prefix,
  suffix,
  title,
  disableCurves,
  titlePosition,
  transparent,
  css,
}: PropsWithChildren<PropTypes>) {
  globalHeaderStyles();

  const renderTitle = () => {
    if (!title) {
      return null;
    } else if (typeof title === 'string') {
      return (
        <Typography variant="headline" size="small">
          {title}
        </Typography>
      );
    }
    return title;
  };

  return (
    <Container
      titlePosition={titlePosition || 'center'}
      transparent={!!transparent}
      css={css}>
      <Prefix>{prefix}</Prefix>
      {renderTitle()}
      <Suffix>{suffix}</Suffix>
      {!disableCurves && (
        <>
          <div className="rng-curve-left" />
          <div className="rng-curve-right" />
        </>
      )}
    </Container>
  );
}
