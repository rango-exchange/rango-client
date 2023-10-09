import type { PropTypes } from './Skeleton.types';

import React from 'react';

import { SkeletonContainer } from './Skeleton.styles';

export function Skeleton(props: PropTypes) {
  const customCss =
    props.variant !== 'text'
      ? {
          width: props.width,
          height: props.height,
        }
      : { width: props.width };
  return <SkeletonContainer css={customCss} {...props} />;
}
