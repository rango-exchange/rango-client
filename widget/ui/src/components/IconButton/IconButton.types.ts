import type { ButtonPropTypes } from '../Button/Button.types';
import type { CSSProperties } from 'react';

export type IconButtonPropTypes = {
  size?: ButtonPropTypes['size'];
  type?: ButtonPropTypes['type'];
  variant?: ButtonPropTypes['variant'];
  onClick?: ButtonPropTypes['onClick'];
  style?: CSSProperties;
  loading?: boolean;
  disabled?: boolean;
};
