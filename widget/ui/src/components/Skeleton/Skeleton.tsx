import type { SkeletonPropTypes } from './Skeleton.types';

import React from 'react';

import { SkeletonContainer } from './Skeleton.styles';

export function Skeleton(props: SkeletonPropTypes) {
  const { width = '100%' } = props;
  const customCss =
    props.variant !== 'text'
      ? {
          width,
          height: props.height,
        }
      : { width };
  return <SkeletonContainer css={customCss} {...props} />;
}
