import React from 'react';

import { ChainToken } from '../ChainToken';
import { Skeleton } from '../Skeleton';

import {
  FlexCenter,
  OutputLoading,
  Separator,
  VerticalLine,
} from './FullExpandedQuote.styles';

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
        <Skeleton width={74} variant="text" size="large" />
        <Skeleton width={80} variant="text" size="large" />
        <Skeleton width={75} variant="text" size="large" />
        <Skeleton width={52} variant="text" size="large" />
        <Skeleton width={95} variant="text" size="large" />
      </FlexCenter>
    </>
  );
}

export function SkeletonOutput() {
  return (
    <OutputLoading>
      <ChainToken
        useAsPlaceholder={true}
        size="medium"
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
    <div
      style={{
        display: 'flex',
        alignItems: 'end',
      }}>
      <Skeleton variant="rounded" width={42} height={49} />
    </div>
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
