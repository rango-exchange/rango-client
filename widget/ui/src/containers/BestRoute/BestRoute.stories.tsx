import React from 'react';
import { ComponentMeta } from '@storybook/react';
import BestRoute, { PropTypes } from './BestRoute';
import { bestRoute } from './mock';

export default {
  title: 'Containers/BestRoute',
  component: BestRoute,
} as ComponentMeta<typeof BestRoute>;

export const Main = (props: PropTypes) => (
  <div style={{ width: 516 }}>
    <BestRoute {...props} bestRoute={bestRoute} />
  </div>
);
