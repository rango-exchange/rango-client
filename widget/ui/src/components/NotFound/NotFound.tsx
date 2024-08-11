import type { NotFoundPropTypes } from './NotFound.types';

import React from 'react';

import { SearchIcon } from '../../icons';
import { Divider } from '../Divider';
import { Typography } from '../Typography';

import { Container } from './NotFound.styles';

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
