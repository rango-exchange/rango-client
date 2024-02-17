import type { PropTypes } from './QuoteSkeleton.types';

import { Divider, Skeleton } from '@rango-dev/ui';
import React from 'react';

import { Chains, Container, Steps } from './QuoteSkeleton.styles';
import { QuoteSummarySkeleton } from './QuoteSummarySkeleton';
import { StepSkeleton } from './StepSkeleton';

export function QuoteSkeleton(props: PropTypes) {
  const { type, expanded, tagHidden = false } = props;

  return (
    <Container rounded={type !== 'basic'}>
      <QuoteSummarySkeleton type={type} tagHidden={tagHidden} />
      <Chains>
        <Skeleton height={15} variant="rounded" />
      </Chains>

      {expanded && (
        <Steps>
          <Divider size={20} />
          <StepSkeleton />
          <StepSkeleton />
          <StepSkeleton separator={false} />
        </Steps>
      )}
    </Container>
  );
}
