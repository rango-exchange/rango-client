import React, { createContext, useContext, useReducer } from 'react';
import {
  ProviderProps,
  Provider as WalletProvider,
} from '@rangodev/wallets-core';
import Adapter from './adapter';
import { ProviderContext } from './types';
import { defaultState, state_reducer } from './helpers';
// @ts-ignore
const AdapterContext = createContext<ProviderContext>({});

function AdapterProvider({
  providers,
  allBlockChains,
  onUpdateState,
  children,
}: ProviderProps) {
  const [modalState, dispatch] = useReducer(state_reducer, defaultState);

  const api: ProviderContext = {
    onOpenModal() {
      dispatch({ value: true });
    },
    onCloseModal() {
      dispatch({ value: false });
    },
  };
  return (
    <WalletProvider
      providers={providers}
      allBlockChains={allBlockChains}
      onUpdateState={onUpdateState}
    >
      <AdapterContext.Provider value={api}>
        {children}
        <Adapter onClose={api.onCloseModal} open={modalState.open} />
      </AdapterContext.Provider>
    </WalletProvider>
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

export default AdapterProvider;
