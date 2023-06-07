import { create } from 'zustand';
import createSelectors from './selectors';
import { immer } from 'zustand/middleware/immer';
import { ProviderContext, WalletProvider } from '@rango-dev/wallets-core';

interface ConfigState {
  external: {
    providers?: WalletProvider[];
    manageProviders?: ProviderContext;
  };

  onChangeProviders: (providers?: WalletProvider[]) => void;
  onChangeManageExternalproviders: (manageExternalProviders?: ProviderContext) => void;
}

export const useExternalProvidersStore = createSelectors(
  create<ConfigState>()(
    immer((set) => ({
      external: {
        providers: undefined,
        manageProviders: undefined,
      },

      onChangeManageExternalproviders: (manageExternalProviders) =>
        set((state) => {
          state.external.manageProviders = manageExternalProviders;
        }),
      onChangeProviders: (providers) =>
        set((state) => {
          state.external.providers = providers;
        }),
    })),
  ),
);
