import React from 'react';
import { SvgIconProps } from '../components/SvgIcon';
import * as Icons from '.';
import { styled } from '../theme';
import { Meta } from '@storybook/react';

export default {
  title: 'Components/Icons',
  component: Icons.AngleDown,
  args: {
    size: 16,
    color: 'black',
  },
  argTypes: {
    color: {
      name: 'color',
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'error',
        'warning',
        'success',
        'black',
        'white',
        'gray',
        'info',
      ],
    },

    size: {
      name: 'size',
      control: { type: 'select' },
      options: [16, 18, 20, 24, 28, 32, 36, 40],
      defaultValue: 16,
    },
  },
} as Meta<any>;

const Container = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto auto auto auto auto',
  gap: 15,
});

export const Main = (props: SvgIconProps) => (
  <Container>
    {Object.keys(Icons).map((icon) => {
      // eslint-disable-next-line
      // @ts-ignore
      const Component = Icons[icon];
      return (
        <div>
          <Component {...props} />
          <p> {icon}</p>
        </div>
      );
    })}
  </Container>
);
