import type { RadioGroupPropTypes } from './RadioGroup.types.js';

import React from 'react';

import { Radio } from '../Radio/index.js';
import { Typography } from '../Typography/index.js';

import {
  Container,
  ItemContainer,
  Label,
  RadioRoot,
} from './RadioGroup.styles.js';

export function RadioGroup(props: RadioGroupPropTypes) {
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
