import type { ProviderContext } from './types.js';

import { createContext } from 'react';

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
  async suggestAndConnect() {
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
  async connectNamespace() {
    throw new Error('');
  },
  async disconnectNamespace() {
    throw new Error('');
  },
  getNamespaceState() {
    throw new Error('');
  },
};

export const WalletContext = createContext<ProviderContext>(defaultContext);
