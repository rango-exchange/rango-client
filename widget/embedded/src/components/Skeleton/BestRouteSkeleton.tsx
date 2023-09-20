import type { ComponentProps } from 'react';

import {
  type BestRoute,
  ChainToken,
  Divider,
  NextIcon,
  Skeleton,
  styled,
} from '@rango-dev/ui';
import React from 'react';

type PropTypes = {
  type: ComponentProps<typeof BestRoute>['type'];
  expanded: boolean;
};

const Container = styled('div', {
  backgroundColor: '$neutral100',
  padding: '$15 ',
  '& cost-and-label': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '22px',
  },
  '& .cost': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '.& .basic-summary': {
    padding: '$15 $0',
  },
  '& .output': {
    padding: '$10 $0',
    display: 'flex',
    flexDirection: 'column',
  },
  '& .output__token-info': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .route-summary': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
  },
  '& .route-summary__separator': {
    height: '$12',
    marginLeft: '$10',
    marginRight: '$10',
    borderLeft: '1px solid $neutral900',
  },
  '& .token-amount': {
    display: 'flex',
    justifyContent: 'space-between',
  },
  '& .token-amount__label': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  '& .chains': {
    paddingTop: '$15',
  },
  '& .step': {},
  '& .step__separator': {},
});

export function BestRouteSkeleton(props: PropTypes) {
  const { type, expanded } = props;
  const routeSummary = (
    <div className="route-summary">
      <div className="token-amount">
        <ChainToken loading size="medium" chainImage="" tokenImage="" />
        <Divider size={8} direction="horizontal" />
        <div className="token-amount__label">
          <Skeleton height={10} width={60} variant="rounded" />
          <Skeleton height={15} width={148} variant="rounded" />
        </div>
      </div>
      <Skeleton height={12} width={64} variant="rounded" />
    </div>
  );

  const step = (
    <div className="step">
      <div className="step__title">
        <Skeleton height={22} width={22} variant="circular" />
        <Divider direction="horizontal" size={8} />
        <Skeleton height={15} width={148} variant="rounded" />
      </div>
      <div>
        <div>
          <ChainToken size="small" loading chainImage="" tokenImage="" />
          <Divider direction="horizontal" size={8} />
          <Skeleton height={12} width={76} variant="rounded" />
        </div>
        <NextIcon color="gray" />
        <div>
          <ChainToken size="small" loading chainImage="" tokenImage="" />
          <Divider direction="horizontal" size={8} />
          <Skeleton height={12} width={76} variant="rounded" />
        </div>
      </div>
    </div>
  );
  return (
    <Container>
      <div className="cost-and-label">
        <div className="cost">
          <Skeleton width={60} height={10} variant="rounded" />
          <Skeleton width={60} height={10} variant="rounded" />
          <Skeleton width={60} height={10} variant="rounded" />
        </div>
        <Skeleton height={22} width={100} variant="rounded" />
      </div>
      {type === 'basic' && (
        <div className="basic-summary">
          <Skeleton height={15} width={148} variant="rounded" />
        </div>
      )}
      {type === 'list-item' && (
        <div className="output">
          <div className="output__token-info">
            <ChainToken loading size="medium" chainImage="" tokenImage="" />
            <Skeleton height={15} width={150} variant="rounded" />
          </div>
          <Skeleton height={48} width={184} variant="rounded" />
        </div>
      )}
      {type === 'swap-preview' && (
        <>
          {routeSummary}
          <div className="route-summary__separator" />
          {routeSummary}
        </>
      )}
      <div className="chains">
        <Skeleton height={15} width={321} variant="rounded" />
      </div>

      {expanded && (
        <>
          {step}
          <div className="step__separator" />
          {step}
          <div className="step__separator" />
          {step}
        </>
      )}
    </Container>
  );
}
