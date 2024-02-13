import type { ToastContainer } from './Toast.styles';
import type { Type } from '../Alert/Alert.types';
import type * as Stitches from '@stitches/react';
import type { CSSProperties } from 'react';

type BaseProps = Stitches.VariantProps<typeof ToastContainer>;
export type ToastPosition = Exclude<BaseProps['position'], object>;
export interface ProviderPropTypes {
  container: HTMLElement;
}

export type ToastType = {
  autoHideDuration?: number;
  id?: number | string;
  containerStyle?: CSSProperties;
  onClose?: () => void;
  position: ToastPosition;
  title: string;
  type: Type;
  style?: CSSProperties;
  hasCloseIcon?: boolean;
  hideOnTap?: boolean;
  variant?: 'custom' | 'standard';
};

export type ToastProps = ToastType & {
  id: number | string;
};

export type ProviderContext = {
  addToast: (content: ToastType) => void;
  removeToast: (id: number | string, position: ToastPosition) => void;
};
