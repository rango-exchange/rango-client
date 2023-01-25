import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';
import { ProviderContext } from './types';
import { defaultState, state_reducer } from './helpers';
import { useWallets } from '@rangodev/wallets-core';
import Modal from './modal';
// @ts-ignore
const AdapterContext = createContext<ProviderContext>({});

function Adapter({ children }: PropsWithChildren) {
  const [modalState, dispatch] = useReducer(state_reducer, defaultState);
  const {
    disconnectAll,
    canSwitchNetworkTo,
    getSigners,
    getWalletInfo,
    providers,
  } = useWallets();
  const api: ProviderContext = {
    onOpenModal() {
      dispatch({ value: true });
    },
    onCloseModal() {
      dispatch({ value: false });
    },
    async disconnectAll() {
      return await disconnectAll();
    },
    canSwitchNetworkTo(type, network) {
      return canSwitchNetworkTo(type, network);
    },
    providers() {
      return providers();
    },
    getWalletInfo(type) {
      return getWalletInfo(type);
    },
    getSigners(type) {
      return getSigners(type);
    },
  };
  return (
    <AdapterContext.Provider value={api}>
      {children}
      <Modal onClose={api.onCloseModal} open={modalState.open} />
    </AdapterContext.Provider>
  );
}

export function useAdapter(): ProviderContext {
  const context = useContext(AdapterContext);
  if (!context)
    throw Error(
      'useModalAdapter can only be used within the Provider component'
    );
  return context;
}

export default Adapter;
