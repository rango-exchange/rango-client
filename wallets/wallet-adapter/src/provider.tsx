import React, { createContext, useContext } from 'react';
import {
  ProviderProps,
  Provider as WalletProvider,
} from '@rangodev/wallets-core';
const AdaptorContext = createContext<any>({});

function ModalProvider(props: ProviderProps) {
  return <WalletProvider {...props}>{props.children}</WalletProvider>;
}

export function useModalAdaptor(): any {
  const context = useContext(AdaptorContext);
  if (!context)
    throw Error('useModalAdaptor can only be used within the Provider component');
  return context;
}

export default ModalProvider;
