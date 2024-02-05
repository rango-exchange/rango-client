import type {
  ProviderContext,
  ProviderPropTypes,
  ToastProps,
  ToastType,
} from './Toast.types';
import type { PropsWithChildren } from 'react';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { Toast } from './Toast';
import { idGenerator } from './Toast.helpers';
import { ToastContainer } from './Toast.styles';

const ToastContext = createContext<ProviderContext | undefined>(undefined);

export const ToastProvider = (props: PropsWithChildren<ProviderPropTypes>) => {
  const generateId = useMemo(() => idGenerator(), []);

  const {
    children,
    anchorOrigin = {
      horizontal: 'right',
      vertical: 'bottom',
    },
    container,
    containerStyle = {},
  } = props;
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const api: ProviderContext = {
    addToast(content: ToastType) {
      setToasts((toasts) => {
        const isToastExistById = toasts.find(
          (toast) => toast.id === content.id
        );
        if (isToastExistById) {
          console.warn(
            'Trying to send a toast with an existing ID. Please update the toast ID or use it after the toast is hidden'
          );
          return toasts;
        }
        return [
          ...toasts,
          {
            ...content,
            id: content.id || generateId(),
            horizontal: anchorOrigin.horizontal,
          },
        ];
      });
    },
    removeToast(id: number | string) {
      setToasts((toasts) => toasts.filter((t) => t.id !== id));
    },
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {container &&
        createPortal(
          <ToastContainer
            style={containerStyle}
            horizontal={anchorOrigin.horizontal}
            vertical={anchorOrigin.vertical}>
            {toasts.map((toast) => (
              <Toast {...toast} key={toast.id} />
            ))}
          </ToastContainer>,
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
