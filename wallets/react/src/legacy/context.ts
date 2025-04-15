import type { ProviderContext } from './types.js';

import { createContext } from 'react';

const defaultErrorMessage = "Context hasn't been initialized yet.";
const defaultContext: ProviderContext = {
  async connect() {
    throw new Error(defaultErrorMessage);
  },
  async disconnect() {
    throw new Error(defaultErrorMessage);
  },
  async disconnectAll() {
    throw new Error(defaultErrorMessage);
  },
  async suggestAndConnect() {
    throw new Error(defaultErrorMessage);
  },
  state() {
    throw new Error(defaultErrorMessage);
  },
  canSwitchNetworkTo() {
    throw new Error(defaultErrorMessage);
  },
  providers() {
    throw new Error(defaultErrorMessage);
  },
  getWalletInfo() {
    throw new Error(defaultErrorMessage);
  },
  getSigners() {
    throw new Error(defaultErrorMessage);
  },
};

export const WalletContext = createContext<ProviderContext>(defaultContext);
