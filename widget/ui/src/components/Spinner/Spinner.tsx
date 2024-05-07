import type { SpinnerPropTypes } from './Spinner.types';

import React from 'react';

import { LoadingIcon } from '../../icons';

import { SpinnerContainer } from './Spinner.styles';

export function Spinner(props: SpinnerPropTypes) {
  const { size, color, css = {} } = props;
  return (
    <SpinnerContainer css={css}>
      <LoadingIcon size={size} color={color} />
    </SpinnerContainer>
  );
}
