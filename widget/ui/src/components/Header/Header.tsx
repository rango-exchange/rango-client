import type { PropTypes } from './Header.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Typography } from '../Typography';

import { Container, Suffix } from './Header.styles';

export function Header({
  prefix,
  suffix,
  title,
}: PropsWithChildren<PropTypes>) {
  return (
    <Container>
      {prefix}
      <Typography variant="headline" size="small">
        {title}
      </Typography>
      <Suffix>{suffix}</Suffix>
    </Container>
  );
}
