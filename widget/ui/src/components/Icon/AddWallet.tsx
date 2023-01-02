import * as React from 'react';

export interface PropTypes {
  color?: string;
  size?: number;
}

const AddWallet = ({ color = 'black', size, ...props }: PropTypes) => (
  <svg
    width={49}
    height={48}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.496 14h22a3 3 0 0 1 3 3v3h-8a4 4 0 0 0 0 8h8v3a3 3 0 0 1-3 3h-22a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3Zm27 12.4V31a5 5 0 0 1-5 5h-22a5 5 0 0 1-5-5V17a5 5 0 0 1 5-5h22a5 5 0 0 1 5 5V26.4Zm-2-4.8v4.8h-8a2.4 2.4 0 1 1 0-4.8h8Zm-7.5 3.9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      fill={color}
    />
    <rect x={3.496} y={25} width={16} height={16} rx={8} fill="#fff" />
    <path
      d="M12.328 29.632a.831.831 0 1 0-1.663 0v2.536H8.128a.831.831 0 1 0 0 1.664h2.537v2.536a.831.831 0 1 0 1.663 0v-2.536h2.537a.831.831 0 1 0 0-1.664h-2.537v-2.536Z"
      fill={color}
      stroke={color}
      strokeWidth={0.4}
    />
  </svg>
);

export default AddWallet;
