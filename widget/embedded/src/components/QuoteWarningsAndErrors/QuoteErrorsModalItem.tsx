import type { ModalContentData } from './QuoteWarningsAndErrors.types';

import { InfoIcon, Tooltip, Typography } from '@rango-dev/ui';
import React from 'react';

import { getContainer } from '../../utils/common';

import {
  Item,
  ValueContent,
  ValueTypography,
} from './QuoteWarningsAndErrors.styles';

const VALUE_LENGTH_THRESHOLD = 35;

export function QuoteErrorsModalItem(props: ModalContentData) {
  const { title, value, valueColor } = props;
  const container = getContainer();

  return (
    <Item>
      <Typography size="medium" variant="label" className="_title">
        {title}
      </Typography>
      <ValueContent>
        <ValueTypography
          size="large"
          variant="label"
          color={valueColor || 'foreground'}>
          {`${valueColor ? '%' : '$'}${value}`}
        </ValueTypography>
        {value.length > VALUE_LENGTH_THRESHOLD && (
          <Tooltip content={value} container={container}>
            <InfoIcon size={12} color="gray" />
          </Tooltip>
        )}
      </ValueContent>
    </Item>
  );
}
