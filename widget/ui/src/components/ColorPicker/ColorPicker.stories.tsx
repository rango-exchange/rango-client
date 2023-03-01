import React, { useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import { ColorPicker, PropTypes } from './ColorPicker';

export default {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  argTypes: {
    place: {
      name: 'place',
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
      defaultValue: 'top',
    },
  },
} as ComponentMeta<typeof ColorPicker>;

export const Main = (args: PropTypes) => {
  const [color, setColor] = useState<string>('#5FA425');
  return (
    <div
      style={{
        height: 600,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ColorPicker
        {...args}
        color={color}
        onChangeColor={(color) => setColor(color.hex)}
      />
    </div>
  );
};
