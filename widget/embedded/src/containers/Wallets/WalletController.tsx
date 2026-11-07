import type {
  WalletController,
  WalletControllerEventHandler,
} from '../../types/walletController';
import type { EventHandler } from '@rango-dev/wallets-react';
import type { PropsWithChildren } from 'react';

import { useWallets } from '@rango-dev/wallets-react';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type WalletEvents = {
  emit: EventHandler;
  subscribe: WalletController['subscribe'];
};

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

export function createWalletEvents(): WalletEvents {
  const handlers = new Set<WalletControllerEventHandler>();
  return {
    emit: (...event) => handlers.forEach((handler) => handler(...event)),
    subscribe: (handler) => {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },
  };
}

type PropTypes = {
  events: WalletEvents;
  onEvent: WalletControllerEventHandler;
};

// Must be rendered inside the wallets-react `Provider`, since it adapts `useWallets()`.
export function WalletControllerScope(props: PropsWithChildren<PropTypes>) {
  const { events } = props;
  const wallets = useWallets();
  const walletsRef = useRef(wallets);
  walletsRef.current = wallets;

  const controller: WalletController = useMemo(
    () => ({
      connect: async (type, namespaces) =>
        walletsRef.current.connect(type, namespaces),
      disconnect: async (type, namespaces) =>
        walletsRef.current.disconnect(type, namespaces),
      state: (type) => walletsRef.current.state(type),
      canSwitchNetworkTo: (type, network, namespace) =>
        walletsRef.current.canSwitchNetworkTo(type, network, namespace),
      getSigners: async (type) => walletsRef.current.getSigners(type),
      getWalletInfo: (type) => walletsRef.current.getWalletInfo(type),
      hubProvider: (type) => walletsRef.current.hubProvider(type),
      subscribe: events.subscribe,
    }),
    [events]
  );

  return (
    <WalletControllerProvider controller={controller} onEvent={props.onEvent}>
      {props.children}
    </WalletControllerProvider>
  );
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
