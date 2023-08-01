import * as React from 'react';
import { IconProps } from './types';
import { selectColor } from './common';
import { styled } from '../../theme';

const Path = styled('path', {});
const Circle = styled('circle', {});

export const TimeIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, color, ...props }, forwardedRef) => {
    const pathCustomCss = {
      fill: `${selectColor(color)}`,
    };

    const circleCustomCss = {
      stroke: `${selectColor(color)}`,
    };

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
        viewBox="0 0 32 32"
        className="_icon"
        fill="none"
        ref={forwardedRef}
        {...props}>
        <Circle
          cx={16}
          cy={16}
          r={9.75}
          css={circleCustomCss}
          strokeWidth={1.3}
        />
        <mask id="a" fill="#fff">
          <path
            fillRule="evenodd"
            d="M15.814 11.4a.6.6 0 0 0-1.2 0v5.91a.6.6 0 0 0 .479.588l3.423 3.135a.472.472 0 0 0 .753-.109.763.763 0 0 0-.133-.919l-3.322-3.042V11.4Z"
            clipRule="evenodd"
          />
        </mask>
        <path
          fillRule="evenodd"
          d="M15.814 11.4a.6.6 0 0 0-1.2 0v5.91a.6.6 0 0 0 .479.588l3.423 3.135a.472.472 0 0 0 .753-.109.763.763 0 0 0-.133-.919l-3.322-3.042V11.4Z"
          clipRule="evenodd"
        />
        <Path
          css={pathCustomCss}
          d="m15.093 17.898.878-.959-.265-.242-.352-.072-.261 1.273Zm3.423 3.135.878-.959-.878.959Zm.753-.109 1.113.672-1.114-.672Zm-.133-.919.878-.958-.878.958Zm-3.322-3.042h-1.3v.573l.422.386.878-.959Zm-.6-4.863a.7.7 0 0 1-.7-.7h2.6a1.9 1.9 0 0 0-1.9-1.9v2.6Zm.7-.7a.7.7 0 0 1-.7.7V9.5a1.9 1.9 0 0 0-1.9 1.9h2.6Zm0 5.91V11.4h-2.6v5.91h2.6Zm-.56-.685a.7.7 0 0 1 .56.685h-2.6a1.9 1.9 0 0 0 1.518 1.862l.522-2.547Zm4.04 3.45-3.423-3.136-1.756 1.918 3.423 3.135 1.756-1.918Zm-1.239.178a.81.81 0 0 1 .58-.37.81.81 0 0 1 .659.191l-1.756 1.918a1.79 1.79 0 0 0 1.467.463 1.79 1.79 0 0 0 1.277-.86l-2.227-1.342Zm.103.711a.568.568 0 0 1-.187-.336.568.568 0 0 1 .084-.375l2.227 1.343a2.062 2.062 0 0 0-.368-2.55l-1.756 1.918Zm-3.322-3.042 3.322 3.042 1.756-1.917-3.322-3.042-1.756 1.917Zm-.422-6.522v5.563h2.6V11.4h-2.6Z"
          mask="url(#a)"
        />
      </svg>
    );
  }
);

TimeIcon.toString = () => '._icon';
