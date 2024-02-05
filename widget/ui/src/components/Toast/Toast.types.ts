import type { Type } from '../Alert/Alert.types';
import type { CSSProperties } from '@stitches/react';

export interface ProviderPropTypes {
  container: HTMLElement;
  anchorOrigin?: {
    horizontal: 'left' | 'right';
    vertical: 'bottom' | 'top';
  };
  containerStyle?: CSSProperties;
}

export type ToastType = { autoHideDuration?: number; id?: number | string } & (
  | {
      title: string;
      type: Type;
      titleColor?: string;
      style?: CSSProperties;
    }
  | { component: React.ReactNode }
);

export type ToastProps = ToastType & {
  id: number | string;
  horizontal: 'left' | 'right';
};

export type ProviderContext = {
  addToast: (content: ToastType) => void;
  removeToast: (id: number | string) => void;
};
