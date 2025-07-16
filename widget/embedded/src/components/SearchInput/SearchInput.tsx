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
    style,
    setValue,
    suffix,
    id,
    ...inputAttributes
  } = props;

  let inputSuffix = !!value.length ? (
    <IconButton
      id={`${id}۰icon-btn`}
      variant="ghost"
      onClick={() => setValue?.('')}
      size="small">
      <CloseIcon color="gray" size={10} />
    </IconButton>
  ) : null;

  if (suffix) {
    inputSuffix = suffix;
  }

  return (
    <TextField
      prefix={
        <IconWrapper>
          <SearchIcon color="black" />
        </IconWrapper>
      }
      id={id}
      suffix={inputSuffix}
      fullWidth={fullWidth}
      color={color}
      variant={variant}
      style={{
        borderRadius: 25,
        alignItems: 'center',
        ...style,
      }}
      size={size}
      value={value}
      onChange={onChange}
      {...inputAttributes}
    />
  );
}
