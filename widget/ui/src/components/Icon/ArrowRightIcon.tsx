import * as React from 'react';
import { IconProps } from './types';
import { SvgWithFillColor } from './common';

export const ArrowRightIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithFillColor
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path d="M8 15.5C7.72386 15.5 7.5 15.7239 7.5 16C7.5 16.2761 7.72386 16.5 8 16.5V15.5ZM24.3536 16.3536C24.5488 16.1583 24.5488 15.8417 24.3536 15.6464L21.1716 12.4645C20.9763 12.2692 20.6597 12.2692 20.4645 12.4645C20.2692 12.6597 20.2692 12.9763 20.4645 13.1716L23.2929 16L20.4645 18.8284C20.2692 19.0237 20.2692 19.3403 20.4645 19.5355C20.6597 19.7308 20.9763 19.7308 21.1716 19.5355L24.3536 16.3536ZM8 16.5H24V15.5H8V16.5Z" />
    </SvgWithFillColor>
  );
};

ArrowRightIcon.toString = () => '._icon';
