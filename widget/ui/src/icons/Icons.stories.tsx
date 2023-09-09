import type { SvgIconProps } from '../components/SvgIcon';
import type { Meta } from '@storybook/react';

import React from 'react';

import { Typography } from '../components/Typography';
import { styled } from '../theme';

import * as Icons from '.';

export default {
  title: 'Components/Icons',
  component: Icons.AutoThemeIcon,
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
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
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
        <div key={icon}>
          <Component {...props} />
          <div />
          <Typography variant="label" size="medium">
            {icon}
          </Typography>
        </div>
      );
    })}
  </Container>
);
