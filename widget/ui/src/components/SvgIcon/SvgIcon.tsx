import React from 'react';
import { SvgWithColor } from './SvgIcon.style';
import { SvgIconPropsWithChildren } from './SvgIcon.types';

export function SvgIcon(props: SvgIconPropsWithChildren) {
  const { size = 16, color, children } = props;
  const originalSvgProps = children.props;
  const commonProps = {
    ...originalSvgProps,
    width: size,
    height: size,
    color: color,
    className: '_icon',
  };

  return (
    <SvgWithColor {...commonProps}>{children.props.children}</SvgWithColor>
  );
}
