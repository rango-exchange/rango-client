import type { ModalContentData } from './QuoteWarningsAndErrors.types';

import { Typography } from '@rango-dev/ui';
import React from 'react';

import { Item } from './QuoteWarningsAndErrors.styles';

export function QuoteErrorsModalItem(props: ModalContentData) {
  const { title, value, valueColor } = props;

  return (
    <Item>
      <Typography size="medium" variant="label" className="_title">
        {title}
      </Typography>
      <Typography
        size="large"
        variant="label"
        color={valueColor || 'foreground'}>
        {`${valueColor ? '%' : '$'}${value}`}
      </Typography>
    </Item>
  );
}
