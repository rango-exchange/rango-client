import type { ProviderContext } from './types';
import type { WalletType } from '@rango-dev/wallets-shared';
import type { PropsWithChildren } from 'react';

import { useWallets } from '@rango-dev/wallets-react';
import React, { createContext, useContext, useMemo, useReducer } from 'react';

import { defaultState, state_reducer } from './helpers';
import Modal from './modal';

// eslint-disable-next-line
// @ts-ignore
const AdapterContext = createContext<ProviderContext>({});

function Adapter({
  children,
  list,
}: PropsWithChildren<{ list: WalletType[] }>) {
  const [modalState, dispatch] = useReducer(state_reducer, defaultState);
  const {
    disconnectAll,
    canSwitchNetworkTo,
    getSigners,
    getWalletInfo,
    providers,
  } = useWallets();
  const api = useMemo(() => {
    const providerContext: ProviderContext = {
      onOpenModal() {
        dispatch({ value: true });
      },
      onCloseModal() {
        dispatch({ value: false });
      },
      async disconnectAll() {
        return await disconnectAll();
      },
      canSwitchNetworkTo(type: string, network: string) {
        return canSwitchNetworkTo(type, network);
      },
      providers() {
        return providers();
      },
      getWalletInfo(type: string) {
        return getWalletInfo(type);
      },
      getSigners(type: string) {
        return getSigners(type);
      },
    };
    return providerContext;
  }, []);
  return (
    <AdapterContext.Provider value={api}>
      {children}
      <Modal list={list} onClose={api.onCloseModal} open={modalState.open} />
    </AdapterContext.Provider>
  );
}

export function useAdapter(): ProviderContext {
  const context = useContext(AdapterContext);
  if (!context) {
    throw Error(
      'useModalAdapter can only be used within the Provider component'
    );
  }
  return context;
}

export default Adapter;
