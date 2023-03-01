import React, { useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import { ColorPicker, PropTypes } from './ColorPicker';

export default {
  title: 'Components/ColorPicker',
  component: ColorPicker,
} as ComponentMeta<typeof ColorPicker>;

export const Main = (args: PropTypes) => {
  const [color, setColor] = useState<string>('#5FA425');
  return (
    <ColorPicker
      {...args}
      color={color}
      onChangeColor={(color) => setColor(color.hex)}
    />
  );
};
