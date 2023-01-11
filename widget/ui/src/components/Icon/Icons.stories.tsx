import React from 'react';
import { Icon, IconProps } from './types';
import * as Icons from '.';
import { ComponentMeta } from '@storybook/react';

export default {
  title: 'Icons',
  component: Icons.AddWallet,
  color: {
    name: 'color',
    control: { type: 'text' },
    defaultValue: '#000',
  },
} as ComponentMeta<typeof Icons.AddWallet>;

export const Main = (props: IconProps) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'auto auto auto auto auto',
      gap: 15,
    }}
  >
    {Object.keys(Icons).map((icon) => {
      const Component = Icons[icon as Icon];
      return <Component {...props} />;
    })}
  </div>
);
