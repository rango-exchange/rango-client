import type { SvgIconPropsWithChildren } from './SvgIcon.types.js';

import React from 'react';

import { SvgWithColor } from './SvgIcon.style.js';

export function SvgIcon(props: SvgIconPropsWithChildren) {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const { size = '1em', color, children } = props;
  const originalSvgProps = children?.props;
  const commonProps = {
    ...originalSvgProps,
    width: size,
    height: size,
    color: color,
    className: '_icon',
  };

  return (
    <SvgWithColor {...commonProps}>{children?.props.children}</SvgWithColor>
  );
}
