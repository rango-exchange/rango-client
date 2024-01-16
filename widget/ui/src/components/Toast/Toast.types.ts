import type { Type } from '../Alert/Alert.types';
import type { CSSProperties } from '@stitches/react';

export interface PropTypes {
  anchorOrigin?: {
    horizontal: 'left' | 'right';
    vertical: 'bottom' | 'top';
  };
  container?: HTMLElement;
  style?: CSSProperties;
}

export type ToastProps = Content & {
  id: number | string;
};
export type ToastPropTypes = ToastProps & {
  horizontal: 'left' | 'right';
};

export type ProviderContext = {
  addToast: (content: ToastType) => void;
  removeToast: (id: number | string) => void;
};

export type Content = {
  title: string;
  type: Type;
  autoHideDuration?: number;
};

export type ToastType = Content & {
  id?: number | string;
};
