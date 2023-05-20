import React from 'react';
import { BestRoute, PropTypes } from './BestRoute';
import { bestRoute, bestRouteExample2, bestRouteExample3 } from './mock';
import { Meta } from '@storybook/react';

export default {
  title: 'Components/Best Route',
  component: BestRoute,
} as Meta<typeof BestRoute>;

export const Main = (props: PropTypes) => (
  <div style={{ maxWidth: 512 }}>
    <BestRoute {...props} data={bestRoute} />
  </div>
);
export const With4Step = (props: PropTypes) => (
  <div style={{ maxWidth: 512 }}>
    <BestRoute {...props} data={bestRouteExample2} />
  </div>
);

export const With2Step = (props: PropTypes) => (
  <div style={{ maxWidth: 512 }}>
    <BestRoute {...props} data={bestRouteExample3} />
  </div>
);
export const WithError = (props: PropTypes) => (
  <div style={{ maxWidth: 512 }}>
    <BestRoute {...props} error="No Route Found" />
  </div>
);
