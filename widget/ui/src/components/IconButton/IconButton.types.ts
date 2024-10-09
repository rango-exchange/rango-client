import type { ButtonPropTypes } from '../Button/Button.types.js';
import type { CSSProperties } from 'react';

export type IconButtonPropTypes = {
  id?: ButtonPropTypes['id'];
  size?: ButtonPropTypes['size'];
  type?: ButtonPropTypes['type'];
  variant?: ButtonPropTypes['variant'];
  onClick?: ButtonPropTypes['onClick'];
  style?: CSSProperties;
  loading?: boolean;
  disabled?: boolean;
};
