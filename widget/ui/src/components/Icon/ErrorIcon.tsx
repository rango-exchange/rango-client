import * as React from 'react';
import { IconProps } from './Icons.type';
import { SvgWithFillColor } from './Icons.style';

export const ErrorIcon: React.FC<IconProps> = (props) => {
  return (
    <SvgWithFillColor
      viewBox="0 0 29 29"
      xmlns="http://www.w3.org/2000/svg"
      className="_icon"
      {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.5 0.5C6.772 0.5 0.5 6.772 0.5 14.5C0.5 22.228 6.772 28.5 14.5 28.5C22.228 28.5 28.5 22.228 28.5 14.5C28.5 6.772 22.228 0.5 14.5 0.5ZM13.1 21.5V18.7H15.9V21.5H13.1ZM13.1 7.5V15.9H15.9V7.5H13.1Z"
      />
    </SvgWithFillColor>
  );
};

ErrorIcon.toString = () => '._icon';
