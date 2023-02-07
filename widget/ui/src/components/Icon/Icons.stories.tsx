import React from 'react';
import { Icon, IconProps } from './types';
import * as Icons from '.';
import { ComponentMeta } from '@storybook/react';
import { styled } from '../../theme';

export default {
  title: 'Components/Icons',
  component: Icons.AngleRightIcon,
  argTypes: {
    color: {
      name: 'color',
      control: { type: 'select' },
      options: ['primary', 'error', 'warning', 'success', 'black', 'white'],
    },

    size: {
      name: 'size',
      control: { type: 'radio' },
      options: [16, 18, 20, 24, 28, 32, 36, 40],
      defaultValue: 16,
    },
  },
} as ComponentMeta<typeof Icons.AngleRightIcon>;

const Container = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto auto auto auto auto',
  gap: 15,
});

export const Main = (props: IconProps) => (
  <Container>
    {Object.keys(Icons).map(icon => {
      const Component = Icons[icon as Icon];
      return (
        <div>
          <Component {...props} />
          <p> {icon}</p>
        </div>
      );
    })}
  </Container>
);
