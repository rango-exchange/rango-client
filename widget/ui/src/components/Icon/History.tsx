import * as React from 'react';
import { IconProps } from './types';

export const History = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', size=50, ...props }, forwardedRef) => {
    return (
      <svg
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M13.467 13a2.15 2.15 0 0 1 2.15-2.15h18.818l-1.704 1.801a3.39 3.39 0 0 0-.603.881l.769.364-.769-.364c-.214.454-.326.95-.326 1.45v20.253a2.15 2.15 0 0 1-2.15 2.15H15.617a2.15 2.15 0 0 1-2.15-2.15V13Z"
          fill="#fff"
          stroke={color}
          strokeWidth={1.7}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.956 17.709c0-.47.38-.85.85-.85h9.469a.85.85 0 0 1 0 1.7h-9.47a.85.85 0 0 1-.85-.85Zm0 2.952c0-.47.38-.85.85-.85h8.072a.85.85 0 1 1 0 1.7h-8.072a.85.85 0 0 1-.85-.85Zm.85 2.1a.85.85 0 1 0 0 1.7h6.676a.85.85 0 1 0 0-1.7h-6.676Z"
          fill={color}
        />
        <path
          d="M35.157 10.75c.73 0 1.3.634 1.222 1.36l-.251 2.342a2.388 2.388 0 0 0 .603 1.857h-4.164v-1.057c0-1.235.38-2.44 1.085-3.453l.38-.401c.22-.233.477-.428.76-.578l.089-.046a.204.204 0 0 1 .095-.024h.18Z"
          fill="#fff"
          stroke={color}
          strokeWidth={1.5}
        />
        <mask id="a" fill="#fff">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.777 32.059a.5.5 0 0 0-.5.5v.676a5.002 5.002 0 0 0 3.847 4.867v.133h15.771c-1.372-1.377-2.438-3.368-1.834-5.425.104-.356-.14-.751-.512-.751H9.777Z"
          />
        </mask>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.777 32.059a.5.5 0 0 0-.5.5v.676a5.002 5.002 0 0 0 3.847 4.867v.133h15.771c-1.372-1.377-2.438-3.368-1.834-5.425.104-.356-.14-.751-.512-.751H9.777Z"
          fill="#fff"
        />
        <path
          d="M13.124 38.102h1.6v-1.266l-1.233-.291-.367 1.557Zm0 .133h-1.6v1.6h1.6v-1.6Zm15.771 0v1.6h3.853l-2.72-2.729-1.133 1.13Zm-1.834-5.425-1.536-.45 1.536.45Zm-1.055-.751-.025 1.6h.025v-1.6Zm-15.13.5a1.1 1.1 0 0 1-1.1 1.1v-3.2a2.1 2.1 0 0 0-2.1 2.1h3.2Zm0 .676v-.676h-3.2v.676h3.2Zm2.615 3.31a3.402 3.402 0 0 1-2.614-3.31h-3.2a6.602 6.602 0 0 0 5.079 6.424l.735-3.114Zm1.233 1.69v-.133h-3.2v.133h3.2Zm14.171-1.6H13.124v3.2h15.771v-3.2Zm-3.37-4.276c-.845 2.881.691 5.454 2.237 7.006l2.267-2.259c-1.199-1.203-1.795-2.611-1.433-3.846l-3.07-.9Zm1.024 1.3c-.425 0-.742-.236-.9-.477a.985.985 0 0 1-.124-.823l3.07.901c.346-1.174-.402-2.801-2.046-2.801v3.2Zm-.543 0h.543v-3.2h-.543v3.2Zm-.003 0h-.022l.05-3.2h-.028v3.2Zm-16.226 0h16.226v-3.2H9.777v3.2Z"
          fill={color}
          mask="url(#a)"
        />
        <path
          d="M18.703 34.655c0 2.52-2.1 4.595-4.728 4.595-2.63 0-4.729-2.075-4.729-4.595 0-2.521 2.1-4.596 4.729-4.596s4.728 2.075 4.728 4.596Z"
          fill="#fff"
          stroke={color}
          strokeWidth={1.5}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.445 32.582a.6.6 0 1 0-1.2 0v2.454c0 .14.047.268.127.37a.705.705 0 0 0 .21.363l1.486 1.327c.247.221.589.172.763-.11a.742.742 0 0 0-.132-.91l-1.254-1.121v-2.373Z"
          fill={color}
        />
      </svg>
    );
  }
);

export default History;
