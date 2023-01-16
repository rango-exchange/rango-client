import React from 'react';
import { Icon, IconProps } from './types';
import * as Icons from '.';
import { ComponentMeta } from '@storybook/react';
import { styled } from '@stitches/react';

export default {
  title: 'Icons',
  component: Icons.AngleRight,
} as ComponentMeta<typeof Icons.AngleRight>;

const IconName = styled('p', {
  color: '$text',
});

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
      return (
        <div>
          <Component {...props} />
          <IconName> {icon}</IconName>
        </div>
      );
    })}
  </div>
);
