import type { PropTypes } from './RadioGroup.types';

import React from 'react';

import { Typography } from '../Typography';

import {
  Container,
  ItemContainer,
  Label,
  StyledIndicator,
  StyledItem,
  StyledRoot,
} from './RadioGroup.styles';

export function RadioGroup(props: PropTypes) {
  const { value, onChange, direction = 'vertical', style } = props;
  return (
    <Container>
      <StyledRoot
        onValueChange={onChange}
        value={value}
        direction={direction}
        style={style}>
        {props.options.map((option) => (
          <ItemContainer key={option.value}>
            <StyledItem value={option.value} id={option.value}>
              <StyledIndicator />
            </StyledItem>
            <Label className="_text" htmlFor={option.value}>
              <Typography variant="body" size="small">
                {option.label}
              </Typography>
            </Label>
          </ItemContainer>
        ))}
      </StyledRoot>
    </Container>
  );
}
