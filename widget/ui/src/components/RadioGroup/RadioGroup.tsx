import type { PropTypes } from './RadioGroup.types';

import React from 'react';

import { Radio } from '../Radio/Radio';
import { Typography } from '../Typography';

import {
  Container,
  ItemContainer,
  Label,
  RadioRoot,
} from './RadioGroup.styles';

export function RadioGroup(props: PropTypes) {
  const { value, onChange, direction = 'vertical', style, options } = props;
  return (
    <Container>
      <RadioRoot
        onValueChange={onChange}
        value={value}
        direction={direction}
        style={style}>
        {options.map((option) => (
          <ItemContainer key={option.value}>
            <Radio value={option.value} />
            <Label className="_text" htmlFor={option.value}>
              <Typography variant="body" size="small">
                {option.label}
              </Typography>
            </Label>
          </ItemContainer>
        ))}
      </RadioRoot>
    </Container>
  );
}
