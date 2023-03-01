import React, { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { styled } from '../../theme';
import { Spacer } from '../Spacer';
import { Typography } from '../Typography';
const ColorContent = styled('div', {
  border: '1px solid $neutrals300',
  padding: '$12',
  borderRadius: '$5',
  display: 'flex',
  alignItems: 'center',
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
}

export function ColorPicker({ color, onChangeColor }: PropTypes) {
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);

  return (
    <div>
      <ColorContent onClick={() => setDisplayColorPicker((prev) => !prev)}>
        <Color style={{ backgroundColor: color }} />
        <Spacer size={12} />
        <Typography variant="body1">{color}</Typography>
      </ColorContent>
      {displayColorPicker && (
        <Popover>
          <Cover onClick={() => setDisplayColorPicker(false)} />
          <ChromePicker color={color} onChange={onChangeColor} />
        </Popover>
      )}
    </div>
  );
}
