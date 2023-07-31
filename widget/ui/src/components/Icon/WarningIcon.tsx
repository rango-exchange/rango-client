import * as React from 'react';
import { IconProps } from './types';
import { SvgWithFillColor } from './common';

export const WarningIcon: React.FC<IconProps> = ({
  size = 16,
  color,
  ...props
}) => {
  return (
    <SvgWithFillColor
      width={size}
      height={size}
      viewBox="0 0 32 22"
      color={color}
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        transform="translate(-6,-10)"
        d="M35.042 35.029H9.96a1.559 1.559 0 0 1-1.355-2.33l12.54-21.958a1.555 1.555 0 0 1 2.127-.58c.242.137.442.337.58.58l12.54 21.967a1.557 1.557 0 0 1-1.354 2.337l.005-.016Zm-13.961-5.632V32.2h2.835v-2.804H21.08Zm-.143-11.498.783 9.997h1.54l.797-9.983-3.12-.014Z"
      />
    </SvgWithFillColor>
  );
};
