import * as React from 'react';
import { IconProps } from './types';
import { SvgWithFillColor } from './common';

export const CheckCircleIcon: React.FC<IconProps> = ({
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
        d="M22.5 36.6a14.1 14.1 0 1 1 14.1-14.1 14.116 14.116 0 0 1-14.1 14.1ZM14.57 21.027a1.322 1.322 0 0 0-.91 2.285l5.766 5.444a1.322 1.322 0 0 0 1.851-.048L31.38 18.132a1.322 1.322 0 0 0-1.915-1.824l-9.18 9.616-4.806-4.537a1.322 1.322 0 0 0-.907-.36h-.002Z"
      />
    </SvgWithFillColor>
  );
};

CheckCircleIcon.toString = () => '._icon';
