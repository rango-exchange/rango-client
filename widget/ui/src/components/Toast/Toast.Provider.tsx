import type {
  PropTypes,
  ProviderContext,
  ToastProps,
  ToastType,
} from './Toast.types';
import type { PropsWithChildren } from 'react';

import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

import { Toast } from './Toast';
import { Wrapper } from './Toast.styles';

const ToastContext = createContext<ProviderContext | undefined>(undefined);

let id = 1;

export const ToastProvider = (props: PropsWithChildren<PropTypes>) => {
  const {
    children,
    anchorOrigin = {
      horizontal: 'right',
      vertical: 'bottom',
    },
    container = document.body,
    style = {},
  } = props;
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const api: ProviderContext = {
    addToast(content: ToastType) {
      setToasts((toasts) => [
        ...toasts,
        {
          ...content,
          id: content.id || id++,
        },
      ]);
    },
    removeToast(id: number | string) {
      setToasts((toasts) => toasts.filter((t) => t.id !== id));
    },
  };

  const uniqueIds = new Set();
  const filteredToasts = toasts.filter((toast) => {
    if (!uniqueIds.has(toast.id)) {
      uniqueIds.add(toast.id);
      return true;
    }
    return false;
  });

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <Wrapper
          style={style}
          horizontal={anchorOrigin.horizontal}
          vertical={anchorOrigin.vertical}>
          {filteredToasts.map((toast) => (
            <Toast
              {...toast}
              key={toast.id}
              id={toast.id}
              horizontal={anchorOrigin?.horizontal}
            />
          ))}
        </Wrapper>,
        container
      )}
    </ToastContext.Provider>
  );
};

export function useToast(): ProviderContext {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      'useToast can only be used within the ToastProvider component'
    );
  }
  return context;
}
