import type { PropTypes } from './Header.types.js';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Typography } from '../Typography/index.js';

import { Container, globalHeaderStyles, Prefix, Suffix } from './Header.styles';

export function Header({
  prefix,
  suffix,
  title,
}: PropsWithChildren<PropTypes>) {
  globalHeaderStyles();

  const getTitlePosition = () => {
    if (!prefix) {
      return 'left';
    }
    if (!suffix) {
      return 'right';
    }
    return 'center';
  };

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
    <Container titlePosition={getTitlePosition()}>
      <Prefix>{prefix}</Prefix>
      {renderTitle()}
      <Suffix>{suffix}</Suffix>
      <div className="rng-curve-left"></div>
      <div className="rng-curve-right"></div>
    </Container>
  );
}
