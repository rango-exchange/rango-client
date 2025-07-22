import type { FlagPropTypes } from '@arlert-dev/ui';
import type { Meta } from '@storybook/react';

import { English, styled, Typography } from '@arlert-dev/ui';
import React from 'react';

import { Flags } from '.';

export default {
  title: 'Components/Flags',
  component: English,
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

export const Main = (props: FlagPropTypes) => (
  <Container>
    {Object.keys(Flags).map((icon) => {
      // eslint-disable-next-line
      // @ts-ignore
      const Component = Flags[icon];
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
