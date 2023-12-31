/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { SvgIconPropsWithChildren } from '../SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../SvgIcon';

import { StyledEllipse, StyledPath } from './RefreshProgressButton.styles';

const DEFAULT_STROKE_DASHOFFSET = 59;
const MAX_PERCENTAGE = 100;
const MAX_PROGRESS = 41;
const MIN_PROGRESS = 0;
const NORMALIZE_FACTOR = 10;
const OPACITY_THRESHOLD = 82;
const DIVISION_FACTOR = 2;

const Ellipse = (props: { fill?: string; progress?: number }) => {
  const type = props.progress ? 'in-progress' : 'basic';
  return (
    <StyledEllipse
      type={type}
      stroke="currentColor"
      strokeDashoffset={props.progress || DEFAULT_STROKE_DASHOFFSET}
    />
  );
};

function RefreshProgressButton(
  props: SvgIconPropsWithChildren & { progress: number }
) {
  const normalizeValue = (value: number) => {
    return (value - OPACITY_THRESHOLD) / NORMALIZE_FACTOR;
  };
  const normalizedProgress = Math.min(
    props.progress / DIVISION_FACTOR,
    MAX_PROGRESS
  );
  const opacity =
    normalizedProgress !== MAX_PROGRESS
      ? MIN_PROGRESS
      : normalizeValue(props.progress);

  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <Ellipse />
      <Ellipse progress={MAX_PERCENTAGE - normalizedProgress} />

      <path
        d="M19.2696 9.6089C19.1207 9.49207 19.0218 9.31141 19.01 9.10738L18.807 5.14476C18.788 4.77467 19.0763 4.45089 19.4464 4.43183C19.8165 4.41278 20.1402 4.70108 20.1593 5.07117L20.3622 9.0338C20.3813 9.40389 20.093 9.72767 19.7229 9.74672C19.5584 9.76661 19.3973 9.70903 19.2696 9.6089Z"
        fill="currentColor"
      />
      <StyledPath
        d="M19.2696 9.6089C19.1207 9.49207 19.0218 9.31141 19.01 9.10738L18.807 5.14476C18.788 4.77467 19.0763 4.45089 19.4464 4.43183C19.8165 4.41278 20.1402 4.70108 20.1593 5.07117L20.3622 9.0338C20.3813 9.40389 20.093 9.72767 19.7229 9.74672C19.5584 9.76661 19.3973 9.70903 19.2696 9.6089Z"
        fillOpacity={opacity}
      />
      <path
        d="M15.5108 9.47903C15.3476 9.35108 15.2457 9.14511 15.2505 8.9198C15.2639 8.55221 15.575 8.25778 15.9482 8.26404L19.707 8.3939C20.0802 8.40016 20.3691 8.71837 20.3628 9.09152C20.3565 9.46466 20.0383 9.75353 19.6652 9.74728L15.9007 9.62451C15.7529 9.62312 15.6243 9.56804 15.5108 9.47903Z"
        fill="currentColor"
      />
      <StyledPath
        d="M15.5108 9.47903C15.3476 9.35108 15.2457 9.14511 15.2505 8.9198C15.2639 8.55221 15.575 8.25778 15.9482 8.26404L19.707 8.3939C20.0802 8.40016 20.3691 8.71837 20.3628 9.09152C20.3565 9.46466 20.0383 9.75353 19.6652 9.74728L15.9007 9.62451C15.7529 9.62312 15.6243 9.56804 15.5108 9.47903Z"
        fillOpacity={opacity}
      />
    </svg>
  );
}
export { RefreshProgressButton };
