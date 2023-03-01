import React, { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { styled } from '../../theme';
import { Button } from '../Button';
import { Typography } from '../Typography';

const Container = styled('div', {
  position: 'relative',
});

const Color = styled('div', {
  border: '1px solid $neutrals300',
  borderRadius: '$5',
  width: '$32',
  height: '$32',
});
const Cover = styled('div', {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
});
const Popover = styled('div', {
  position: 'absolute',
  zIndex: '2',
});
export interface PropTypes {
  color: string;
  onChangeColor: (
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  label?: string;
}

export function ColorPicker({ color, onChangeColor, label }: PropTypes) {
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);

  return (
    <Container>
      <Typography mb={4} variant="body2">
        {label}
      </Typography>
      <Button
        variant="outlined"
        prefix={<Color style={{ backgroundColor: color }} />}
        fullWidth
        align="start"
        size="large"
        onClick={() => setDisplayColorPicker((prev) => !prev)}
      >
        {color}
      </Button>

      {displayColorPicker && (
        <Popover>
          <Cover onClick={() => setDisplayColorPicker(false)} />
          <ChromePicker color={color} onChange={onChangeColor} />
        </Popover>
      )}
    </Container>
  );
}
