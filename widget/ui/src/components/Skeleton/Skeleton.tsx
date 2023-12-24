import type { PropTypes } from './Skeleton.types';

import React from 'react';

import { SkeletonContainer } from './Skeleton.styles';

export function Skeleton(props: PropTypes) {
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
