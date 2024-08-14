import type { SkeletonPropTypes } from './Skeleton.types.js';

import React from 'react';

import { SkeletonContainer } from './Skeleton.styles.js';

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
