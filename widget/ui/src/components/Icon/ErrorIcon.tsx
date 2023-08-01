import * as React from 'react';
import { IconProps } from './types';
import { SvgWithFillColor } from './common';

export const ErrorIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithFillColor
      viewBox="0 0 45 45"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22.5 8.5C14.772 8.5 8.5 14.772 8.5 22.5C8.5 30.228 14.772 36.5 22.5 36.5C30.228 36.5 36.5 30.228 36.5 22.5C36.5 14.772 30.228 8.5 22.5 8.5ZM21.1 29.5V26.7H23.9V29.5H21.1ZM21.1 15.5V23.9H23.9V15.5H21.1Z"
      />
    </SvgWithFillColor>
  );
};

ErrorIcon.toString = () => '._icon';
