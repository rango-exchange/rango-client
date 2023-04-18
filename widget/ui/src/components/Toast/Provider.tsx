import React, { useState, useContext, PropsWithChildren } from 'react';
import { createContext } from 'react';
import { Toast } from './Toast';
import { styled } from '../../theme';

type ProviderContext = {
  addToast: (content: Content) => void;
  removeToast: (id: number) => void;
};
// TODO fix lint problem
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ToastContext = createContext<ProviderContext>({});

let id = 1;

export type Content = {
  message: string;
  title?: string;
  hasClose?: boolean;
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showIcon?: boolean;
};

export type ToastType = Content & {
  id: number;
};
const Wrapper = styled('div', {
  position: 'absolute',
  zIndex: 9999,
  variants: {
    horizontal: {
      right: {
        right: 12,
        transition: 'transform .6s ease-in-out',
        animation: 'toast-in-right .7s',
      },
      left: {
        left: 12,
        transition: 'transform .6s ease-in',
        animation: 'toast-in-left .7s',
      },
    },

    vertical: {
      top: {
        top: 0,
      },
      bottom: {
        bottom: 0,
      },
    },
  },
});

export const ToastProvider = ({
  children,
  anchorOrigin = {
    horizontal: 'right',
    vertical: 'bottom',
  },
}: PropsWithChildren & {
  anchorOrigin?: {
    horizontal: 'left' | 'right';
    vertical: 'bottom' | 'top';
  };
}) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const api: ProviderContext = {
    addToast(content: Content) {
      setToasts((toasts) => [
        ...toasts,
        {
          id: id++,
          ...content,
        },
      ]);
    },
    removeToast(id: number) {
      setToasts((toasts) => toasts.filter((t) => t.id !== id));
    },
  };
  return (
    <ToastContext.Provider value={api}>
      {children}
      <Wrapper
        horizontal={anchorOrigin.horizontal}
        vertical={anchorOrigin.vertical}
      >
        {toasts.map((toast) => (
          <Toast
            {...toast}
            key={toast.id}
            horizontal={anchorOrigin?.horizontal}
          />
        ))}
      </Wrapper>
      <div style={{ position: 'absolute', bottom: 0, right: 0 }}></div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const toastHelpers = useContext(ToastContext);
  return toastHelpers;
};

export { ToastContext, useToast };
