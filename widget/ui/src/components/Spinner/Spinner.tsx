import type { SpinnerPropTypes } from './Spinner.types.js';

import React from 'react';

import { LoadingIcon } from '../../icons/index.js';

import { SpinnerContainer } from './Spinner.styles.js';

export function Spinner(props: SpinnerPropTypes) {
  const { size, color, css = {} } = props;
  return (
    <SpinnerContainer css={css}>
      <LoadingIcon size={size} color={color} />
    </SpinnerContainer>
  );
}
