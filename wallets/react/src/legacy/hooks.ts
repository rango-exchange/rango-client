import type { ProviderContext } from './types.js';

import { useContext } from 'react';

import { WalletContext } from './context.js';

export function useWallets(): ProviderContext {
  const context = useContext(WalletContext);
  if (!context) {
    throw Error('useWallet can only be used within the Provider component');
  }
  return context;
}
