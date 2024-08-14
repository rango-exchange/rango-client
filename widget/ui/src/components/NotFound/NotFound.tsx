import type { NotFoundPropTypes } from './NotFound.types.js';

import React from 'react';

import { SearchIcon } from '../../icons/index.js';
import { Divider } from '../Divider/index.js';
import { Typography } from '../Typography/index.js';

import { Container } from './NotFound.styles.js';

export function NotFound(props: NotFoundPropTypes) {
  const { hasIcon = true, titleColor } = props;
  return (
    <Container>
      {hasIcon && <SearchIcon color="secondary" size={26} />}
      <Divider size={4} />
      <Typography variant="title" size="medium" color={titleColor}>
        {props.title}
      </Typography>
      <Divider size={10} />
      <Typography variant="body" size="medium" color="neutral700">
        {props.description}
      </Typography>
    </Container>
  );
}
