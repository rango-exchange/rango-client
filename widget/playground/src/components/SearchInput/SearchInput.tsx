import type { PropTypes } from './SearchInput.types';

import { CloseIcon, IconButton, SearchIcon, TextField } from '@rango-dev/ui';
import React from 'react';

import { IconWrapper, InputContainer } from './SearchInput.styles';

export function SearchInput(props: PropTypes) {
  const { fullWidth, color, size, value, setValue, ...inputAttributes } = props;

  return (
    <InputContainer>
      <TextField
        onChange={(e) => setValue(e.target.value)}
        value={value}
        variant="contained"
        prefix={
          <IconWrapper>
            <SearchIcon color="gray" />
          </IconWrapper>
        }
        suffix={
          <IconButton
            style={!!value.length ? { display: 'unset' } : undefined}
            variant="ghost"
            onClick={() => setValue('')}
            size="small">
            <CloseIcon color="gray" size={10} />
          </IconButton>
        }
        {...inputAttributes}
      />
    </InputContainer>
  );
}
