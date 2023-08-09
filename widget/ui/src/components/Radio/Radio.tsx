import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { styled } from '../../theme';
import { Typography } from '../Typography';
import { CSSProperties } from '@stitches/react';

const StyledRoot = styled(RadioGroup.Root, {
  variants: {
    direction: {
      horizontal: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      vertical: {
        display: 'grid',
        gridGap: '$24',
      },
    },
  },
});

const ItemContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginRight: '$8',
});
const StyledItem = styled(RadioGroup.Item, {
  padding: '0',
  width: '20px',
  height: '20px',
  borderRadius: '100%',
  cursor: 'pointer',
  backgroundColor: '$background',
  border: '1px solid $neutral400',

  '&:hover': {
    borderColor: '$neutral600',
  },
});

const Container = styled('div', {
  display: 'flex',
});

const StyledIndicator = styled(RadioGroup.Indicator, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',
  '&::after': {
    content: '',
    display: 'block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '$success',
  },
});

const Label = styled('label', {
  paddingLeft: '$8',
  cursor: 'pointer',
  color: '$foreground',
});

export interface PropTypes {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  style?: CSSProperties;
}

export function Radio(props: PropTypes) {
  const { value, onChange, direction = 'vertical', style } = props;
  return (
    <Container>
      <StyledRoot
        onValueChange={onChange}
        value={value}
        direction={direction}
        style={style}>
        {props.options.map((option, index) => (
          <ItemContainer key={index}>
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
