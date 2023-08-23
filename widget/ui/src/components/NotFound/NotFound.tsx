import type { PropTypes } from './NotFound.types';

import React from 'react';

import { SearchIcon } from '../../icons';
import { Divider } from '../Divider';
import { Typography } from '../Typography';

import { Container } from './NotFound.styles';

export function NotFound({ title, subTitle }: PropTypes) {
  return (
    <Container>
      <SearchIcon color="secondary" size={26} />
      <Divider size={4} />
      <Typography variant="title" size="medium">
        {title}
      </Typography>
      <Typography variant="body" size="medium" color="neutral600">
        {subTitle}
      </Typography>
    </Container>
  );
}
