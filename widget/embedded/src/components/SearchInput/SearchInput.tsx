import type { PropTypes } from './SearchInput.types';

import { CloseIcon, IconButton, SearchIcon, TextField } from '@rango-dev/ui';
import React from 'react';

import { IconWrapper } from './SearchInput.styles';

export function SearchInput(props: PropTypes) {
  const {
    variant,
    fullWidth,
    color,
    size,
    onChange,
    value,
    setValue,
    ...inputAttributes
  } = props;

  return (
    <TextField
      prefix={
        <IconWrapper>
          <SearchIcon color="black" />
        </IconWrapper>
      }
      suffix={
        !!value.length && (
          <IconButton
            variant="ghost"
            onClick={() => setValue?.('')}
            size="small">
            <CloseIcon color="gray" size={10} />
          </IconButton>
        )
      }
      fullWidth={fullWidth}
      color={color}
      variant={variant}
      style={{
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
      }}
      size={size}
      value={value}
      onChange={onChange}
      {...inputAttributes}
    />
  );
}
