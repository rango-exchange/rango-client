import type { WalletsSetup } from './providers';
import type { Provider } from '@hub3js/core';
import type { EventHandler } from '@rango-dev/wallets-react';
import type {
  WalletController,
  WalletControllerEventHandler,
} from '@rango-dev/widget-embedded';
import type { BlockchainMeta } from 'rango-types';
import type { ReactElement } from 'react';

import { WalletTypes } from '@rango-dev/provider-all';
import {
  useWallets,
  Provider as WalletsProvider,
} from '@rango-dev/wallets-react';
import { useWidget } from '@rango-dev/widget-embedded';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type WalletEvents = {
  emit: EventHandler;
  subscribe: WalletController['subscribe'];
};

type WidgetStatus = { blockchains: BlockchainMeta[]; isActiveTab: boolean };

function createWalletEvents(): WalletEvents {
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

function createWalletOptions(
  setup: WalletsSetup,
  blockchains: BlockchainMeta[]
) {
  return {
    [WalletTypes.TON_CONNECT]: {
      provider: { manifestUrl: setup.tonConnect?.manifestUrl },
    },
    [WalletTypes.OKX]: {
      provider: { tonConnectManifestUrl: setup.tonConnect?.manifestUrl },
    },
    [WalletTypes.TREZOR]: {
      provider: { manifest: setup.trezorManifest },
    },
    [WalletTypes.WALLET_CONNECT_2]: {
      provider: {
        WC_PROJECT_ID: setup.walletConnectProjectId || '',
        DISABLE_MODAL_AND_OPEN_LINK: setup.walletConnectListedDesktopWalletLink,
        meta: blockchains,
      },
    },
    [WalletTypes.LEDGER_WALLET]: {
      provider: setup.ledgerWallet,
    },
  };
}

// Stable, so the widget doesn't re-subscribe on every render.
export function useWalletController(events: WalletEvents): WalletController {
  const wallets = useWallets();
  const walletsRef = useRef(wallets);
  walletsRef.current = wallets;

  return useMemo(
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
}

/**
 * The wallets engine needs the blockchains, which the widget fetches. It reports them (and whether
 * this tab is the active one, for auto connect) to the engine above the widget.
 */
function WidgetStatusReporter(props: {
  onChange: (status: WidgetStatus) => void;
}): null {
  const { meta, isActiveTab } = useWidget();
  useEffect(() => {
    props.onChange({ blockchains: meta.blockchains, isActiveTab });
  }, [meta.blockchains, isActiveTab]);
  return null;
}

type WalletsHostProps = {
  providers: Provider[];
  setup: WalletsSetup;
  children: (
    controller: WalletController,
    reporter: ReactElement
  ) => ReactElement;
};

function ControllerScope(
  props: Pick<WalletsHostProps, 'children'> & {
    events: WalletEvents;
    onStatusChange: (status: WidgetStatus) => void;
  }
) {
  const controller = useWalletController(props.events);
  return props.children(
    controller,
    <WidgetStatusReporter onChange={props.onStatusChange} />
  );
}

// `children` should render the returned reporter inside `WidgetProvider`.
export function WalletsHost(props: WalletsHostProps) {
  const { providers, setup } = props;
  const events = useMemo(createWalletEvents, []);
  const [status, setStatus] = useState<WidgetStatus>({
    blockchains: [],
    isActiveTab: false,
  });
  const walletOptions = useMemo(
    () => createWalletOptions(setup, status.blockchains),
    [setup, status.blockchains]
  );

  return (
    <WalletsProvider
      providers={providers}
      allBlockChains={status.blockchains}
      autoConnect={status.isActiveTab}
      onUpdateState={events.emit}
      configs={{ wallets: providers, walletOptions }}>
      <ControllerScope events={events} onStatusChange={setStatus}>
        {props.children}
      </ControllerScope>
    </WalletsProvider>
  );
}
