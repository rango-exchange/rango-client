import React from 'react';

import { ChainToken } from '../ChainToken/index.js';
import { Skeleton } from '../Skeleton/index.js';

import {
  FlexCenter,
  OutputLoading,
  Separator,
  SkeletonItemLeftContainer,
  VerticalLine,
} from './FullExpandedQuote.styles.js';

export function SkeletonHeader() {
  return (
    <>
      <FlexCenter>
        <Skeleton width={57.5} variant="text" size="large" />
        <Separator />
        <Skeleton width={57.5} variant="text" size="large" />
        <Separator />
        <Skeleton width={25.5} variant="text" size="large" />
      </FlexCenter>
      <FlexCenter
        css={{
          gap: '$5',
        }}>
        <Skeleton width={153} variant="text" size="large" />
      </FlexCenter>
    </>
  );
}

export function SkeletonOutput() {
  return (
    <OutputLoading>
      <ChainToken
        useAsPlaceholder={true}
        size="large"
        chainImage=""
        tokenImage=""
        loading={true}
      />
      <Skeleton variant="rounded" width={122} height={29} />
    </OutputLoading>
  );
}
export function SkeletonItemLeft() {
  return (
    <SkeletonItemLeftContainer>
      <Skeleton variant="rounded" width={42} height={49} />
    </SkeletonItemLeftContainer>
  );
}

export function SkeletonItemRight() {
  return (
    <FlexCenter
      css={{
        flexDirection: 'column',
        gap: '$2',
      }}>
      <Skeleton variant="circular" width={30} height={30} />
      <VerticalLine
        css={{
          width: 'unset',
        }}
      />
    </FlexCenter>
  );
}
