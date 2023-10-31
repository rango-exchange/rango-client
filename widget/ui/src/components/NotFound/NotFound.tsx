import type { PropTypes } from './NotFound.types';

import React from 'react';

import { SearchIcon } from '../../icons';
import { Divider } from '../Divider';
import { Typography } from '../Typography';

import { Container } from './NotFound.styles';

export function NotFound(props: PropTypes) {
  return (
    <Container>
      <SearchIcon color="secondary" size={26} />
      <Divider size={4} />
      <Typography variant="title" size="medium">
        {props.title}
      </Typography>
      <Typography variant="body" size="medium" color="neutral700">
        {props.description}
      </Typography>
    </Container>
  );
}
