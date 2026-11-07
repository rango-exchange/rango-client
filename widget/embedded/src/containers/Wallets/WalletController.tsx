import type {
  WalletController,
  WalletControllerEventHandler,
} from '../../types/walletController';
import type { PropsWithChildren } from 'react';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/*
 * `version` changes on every wallet update, so the components using the controller re-render
 * even though the controller object itself is stable.
 */
const WalletControllerContext = createContext<{
  controller: WalletController;
  version: number;
} | null>(null);

export function useWalletController(): WalletController {
  const context = useContext(WalletControllerContext);
  if (!context) {
    throw new Error(
      '`useWalletController` should be used inside `WidgetProvider`.'
    );
  }
  return context.controller;
}

export function WalletControllerProvider(
  props: PropsWithChildren<{
    controller: WalletController;
    onEvent: WalletControllerEventHandler;
  }>
) {
  const { controller } = props;
  // The subscription is created once per controller, so it reads the latest handler from here.
  const onEventRef = useRef(props.onEvent);
  onEventRef.current = props.onEvent;
  const [version, setVersion] = useState(0);

  useEffect(
    () =>
      controller.subscribe((...event) => {
        onEventRef.current(...event);
        setVersion((currentVersion) => currentVersion + 1);
      }),
    [controller]
  );

  const value = useMemo(() => ({ controller, version }), [controller, version]);

  return (
    <WalletControllerContext.Provider value={value}>
      {props.children}
    </WalletControllerContext.Provider>
  );
}
