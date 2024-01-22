import type { PropTypes } from './Header.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Typography } from '../Typography';

import { Container, globalHeaderStyles, Suffix } from './Header.styles';

export function Header({
  prefix,
  suffix,
  title,
}: PropsWithChildren<PropTypes>) {
  globalHeaderStyles();

  return (
    <Container>
      {prefix}
      <Typography variant="headline" size="small">
        {title}
      </Typography>
      <Suffix>{suffix}</Suffix>
      <div className="rng-curve-left"></div>
      <div className="rng-curve-right"></div>
    </Container>
  );
}
