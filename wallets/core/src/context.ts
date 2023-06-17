import { createContext } from 'react';
import { ProviderContext } from './types';

const defaultErrorMesssage = "Context hasn't been initialized yet.";
const defaultContext: ProviderContext = {
  async connect() {
    throw new Error(defaultErrorMesssage);
  },
  async disconnect() {
    throw new Error(defaultErrorMesssage);
  },
  async disconnectAll() {
    throw new Error(defaultErrorMesssage);
  },
  state() {
    throw new Error(defaultErrorMesssage);
  },
  canSwitchNetworkTo() {
    throw new Error(defaultErrorMesssage);
  },
  providers() {
    throw new Error(defaultErrorMesssage);
  },
  getWalletInfo() {
    throw new Error(defaultErrorMesssage);
  },
  getSigners() {
    throw new Error(defaultErrorMesssage);
  },
};

export const WalletContext = createContext<ProviderContext>(defaultContext);
