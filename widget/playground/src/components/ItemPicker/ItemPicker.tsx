import type { PropTypes } from './ItemPicker.types';

import { ChevronRightIcon, Typography } from '@rango-dev/ui';
import React from 'react';

import { TextContainer } from './ItemPicker.styles';

function ItemPicker(props: PropTypes) {
  const { onClick, value = '' } = props;

  return (
    <TextContainer onClick={onClick}>
      <Typography size="medium" variant="label" color="neutral900">
        {value}
      </Typography>
      <ChevronRightIcon size={12} color="gray" />
    </TextContainer>
  );
}

export default React.memo(ItemPicker);
