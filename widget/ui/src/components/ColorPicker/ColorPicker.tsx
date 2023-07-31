import React, { useState } from 'react';
import { styled } from '../../theme';
import { Button } from '../Button';
import { CloseIcon } from '../Icon';
import rgbHex from 'rgb-hex';
import ReactColor from 'react-color';

const { ChromePicker } = ReactColor;

const Container = styled('div', {
  position: 'relative',
});

const Color = styled('div', {
  border: '1px solid $neutral100',
  borderRadius: '$xs',
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
  variants: {
    place: {
      top: {
        top: '-241px',
      },
      bottom: {},
      left: {
        top: '-50%',
        left: '-225px',
      },
      right: {
        top: '-50%',
        right: '-225px',
      },
    },
  },
});
export interface PropTypes {
  color?: string;
  place: 'top' | 'bottom' | 'left' | 'right';
  onChangeColor: (color?: string) => void;
  label?: string;
  placeholder?: string;
}

const Label = styled('label', {
  display: 'inline-block',
  fontSize: '$14',
  marginBottom: '$4',
  color: '$foreground',
});

export function ColorPicker({
  color,
  onChangeColor,
  label,
  place,
  placeholder,
}: PropTypes) {
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);

  return (
    <Container>
      <Label className="_text">{label}</Label>
      <Button
        variant="outlined"
        prefix={<Color style={{ backgroundColor: color }} />}
        fullWidth
        align="start"
        size="large"
        suffix={
          color && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onChangeColor(undefined);
              }}>
              <CloseIcon size={20} />
            </div>
          )
        }
        onClick={() => setDisplayColorPicker((prev) => !prev)}>
        {color || placeholder}
      </Button>

      {displayColorPicker && (
        <Popover place={place}>
          <Cover onClick={() => setDisplayColorPicker(false)} />
          <ChromePicker
            color={color}
            onChange={(c) => {
              const color = '#' + rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a);
              onChangeColor(color);
            }}
          />
        </Popover>
      )}
    </Container>
  );
}
