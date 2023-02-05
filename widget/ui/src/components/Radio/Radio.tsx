import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { styled } from '../../theme';
import { Typography } from '../Typography';

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
  marginRight: '$24',
});

const StyledItem = styled(RadioGroup.Item, {
  backgroundColor: '$neutrals300',
  width: '20px',
  height: '20px',
  borderRadius: '100%',
  border: 'none',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$neutrals400',
  },
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
    backgroundColor: '$primary',
  },
});

const Label = styled('label', {
  paddingLeft: '$16',
  cursor: 'pointer',
});

export interface PropTypes {
  options: { label: string; value: string }[];
  defaultValue: string;
  onChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  style?: React.CSSProperties;
}

export function Radio(props: PropTypes) {
  const { defaultValue, onChange, direction = 'vertical', style } = props;
  return (
    <form>
      <StyledRoot
        onValueChange={onChange}
        defaultValue={defaultValue}
        direction={direction}
        css={style}
      >
        {props.options.map((option) => (
          <ItemContainer>
            <StyledItem value={option.value} id={option.value}>
              <StyledIndicator />
            </StyledItem>
            <Label htmlFor={option.value}>
              <Typography variant="body2">{option.label}</Typography>
            </Label>
          </ItemContainer>
        ))}
      </StyledRoot>
    </form>
  );
}
