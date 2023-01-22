import React from 'react';
import { Icon, IconProps } from './types';
import * as Icons from '.';
import { ComponentMeta } from '@storybook/react';
import { styled } from '../../theme';

export default {
  title: 'Icons',
  component: Icons.AngleRight,
} as ComponentMeta<typeof Icons.AngleRight>;

const Container = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto auto auto auto auto',
  gap: 15,
});

export const Main = (props: IconProps) => (
  <Container>
    {Object.keys(Icons).map((icon) => {
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
