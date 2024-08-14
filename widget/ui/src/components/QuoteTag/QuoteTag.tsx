import type { RouteTag, Tag } from 'rango-types/lib/api/main';

import React from 'react';

import { Typography } from '../Typography/index.js';

import { getLabelStyles, TagContainer } from './QuoteTag.styles.js';

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
