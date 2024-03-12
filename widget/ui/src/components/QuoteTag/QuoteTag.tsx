import type { RouteTag, Tag } from 'rango-sdk';

import React from 'react';

import { Typography } from '../Typography';

import { getLabelStyles, TagContainer } from './QuoteTag.styles';

export const QuoteTag = (props: RouteTag) => {
  const { value, label } = props;

  return (
    <TagContainer type={value as Tag}>
      <Typography variant="body" size="small" className={getLabelStyles()}>
        {label}
      </Typography>
    </TagContainer>
  );
};
