import type { BestRouteResponse } from 'rango-sdk';

import React from 'react';

import { darkTheme, styled } from '../../theme';
import { Divider } from '../Divider';
import { AngleRightIcon, GasIcon } from '../Icon';

export const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$8',
  borderRadius: '$xs',
  backgroundColor: '$background',
  $$color: '$colors$neutral600',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral700',
  },
  color: '$$color',
  fontSize: '$12',

  '.routes': {
    display: 'flex',
    alignItems: 'center',
  },
  '.fee': {
    display: 'flex',
    alignItems: 'center',
  },
});

interface PropTypes {
  routes: BestRouteResponse | null;
  totalFee?: string;
}
export function RoutesOverview(props: PropTypes) {
  if (!props.routes) {
    return null;
  }

  const swaps = props.routes.result?.swaps;
  return (
    <Container>
      <div className="routes">
        {swaps?.map((swap, idx) => {
          const isLast = idx + 1 == swaps.length;
          const key = `swap-${idx}`;
          return (
            <React.Fragment key={key}>
              <div className="route">{swap.from.symbol}</div>
              <AngleRightIcon size={12} />
              {isLast ? <div className="route">{swap.to.symbol}</div> : null}
            </React.Fragment>
          );
        })}
      </div>
      {props.totalFee ? (
        <div className="fee">
          <GasIcon size={12} />
          <Divider size={4} direction="horizontal" />${props.totalFee}
        </div>
      ) : null}
    </Container>
  );
}
