import type {
  ProviderContext,
  ProviderPropTypes,
  ToastPosition,
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

const renderToastContainer = (
  toasts: ToastProps[],
  position: ToastPosition
) => (
  <>
    {toasts.length > 0 && (
      <ToastContainer style={toasts[0].containerStyle} position={position}>
        {toasts.map((toast) => (
          <Toast {...toast} key={toast.id} />
        ))}
      </ToastContainer>
    )}
  </>
);

export const ToastProvider = (props: PropsWithChildren<ProviderPropTypes>) => {
  const generateId = useMemo(() => idGenerator(), []);

  const { children, container } = props;
  const [leftTopToasts, setLeftTopToasts] = useState<ToastProps[]>([]);
  const [leftBottomToasts, setLeftBottomToasts] = useState<ToastProps[]>([]);
  const [rightTopToasts, setRightTopToasts] = useState<ToastProps[]>([]);
  const [rightBottomToasts, setRightBottomToasts] = useState<ToastProps[]>([]);
  const [centerTopToasts, setCenterTopToasts] = useState<ToastProps[]>([]);
  const [centerBottomToasts, setCenterBottomToasts] = useState<ToastProps[]>(
    []
  );

  const getToastSetter = (position: ToastPosition) => {
    switch (position) {
      case 'right-top':
        return setRightTopToasts;
      case 'right-bottom':
        return setRightBottomToasts;
      case 'left-top':
        return setLeftTopToasts;
      case 'left-bottom':
        return setLeftBottomToasts;
      case 'center-top':
        return setCenterTopToasts;
      default:
        return setCenterBottomToasts;
    }
  };

  const handleAddToast = (content: ToastType) => {
    const addToasts = () => getToastSetter(content.position);

    addToasts()((toasts) => {
      const isToastExistById = toasts.find((toast) => toast.id === content.id);
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
        },
      ];
    });
  };

  const handleRemoveToast = (id: number | string, position: ToastPosition) => {
    const removeFromToasts = () => getToastSetter(position);

    removeFromToasts()((toasts) => toasts.filter((t) => t.id !== id));
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const toastApis = {
    addToast: (content: ToastType) => handleAddToast(content),
    removeToast: (id: number | string, position: ToastPosition) =>
      handleRemoveToast(id, position),
  };

  return (
    <ToastContext.Provider value={toastApis}>
      {children}
      {container &&
        createPortal(
          <>
            {renderToastContainer(rightTopToasts, 'right-top')}
            {renderToastContainer(leftTopToasts, 'left-top')}
            {renderToastContainer(centerTopToasts, 'center-top')}
            {renderToastContainer(rightBottomToasts, 'right-bottom')}
            {renderToastContainer(leftBottomToasts, 'left-bottom')}
            {renderToastContainer(centerBottomToasts, 'center-bottom')}
          </>,
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
