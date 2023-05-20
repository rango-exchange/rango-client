import React from 'react';
import { styled, ChevronRightIcon, GasIcon, Divider } from '@rango-dev/ui';
import { BestRouteResponse } from 'rango-sdk';

export const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$8',
  borderRadius: '$5',
  backgroundColor: '$neutral100',
  color: '$neutral800',
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
function RoutesOverview(props: PropTypes) {
  if (!props.routes) return null;

  const swaps = props.routes.result?.swaps;
  return (
    <Container>
      <div className="routes">
        {swaps?.map((swap, idx) => {
          const isLast = idx + 1 == swaps.length;
          return (
            <React.Fragment key={idx}>
              <div className="route">{swap.from.symbol}</div>
              <ChevronRightIcon size={12} />
              {isLast ? <div className="route">{swap.to.symbol}</div> : null}
            </React.Fragment>
          );
        })}
      </div>
      {props.totalFee ? (
        <div className="fee">
          <GasIcon size={12} />
          <Divider size={4} />${props.totalFee}
        </div>
      ) : null}
    </Container>
  );
}

export default RoutesOverview;
