import type { ModalContentData } from './RouteErrors.types';

import { Typography } from '@rango-dev/ui';
import React from 'react';

import { Item } from './RouteErrors.styles';

export function RouteErrorsModalItem(props: ModalContentData) {
  const { title, value, valueColor } = props;

  return (
    <Item>
      <Typography size="medium" variant="label" color="neutral600">
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
