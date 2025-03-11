import type { WidgetConfig } from '../types';
import type { AppStoreState } from './slices/types';
import type { StateCreator } from 'zustand';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createConfigSlice } from './slices/config';
import { createDataSlice } from './slices/data';
import { createSettingsSlice } from './slices/settings';
import { createWalletsSlice } from './slices/wallets';

export type StateCreatorWithInitialData<
  T extends Partial<WidgetConfig>,
  R extends Partial<AppStoreState>,
  V extends Partial<AppStoreState>
> = (
  initialData: T | undefined,
  ...rest: Parameters<StateCreator<R, [], [], V>>
) => ReturnType<StateCreator<R, [], [], V>>;

export type { AppStoreState };

export function createAppStore(initialData?: WidgetConfig) {
  return create<AppStoreState>()(
    persist(
      (...a) => ({
        ...createWalletsSlice(...a),
        ...createDataSlice(...a),
        ...createSettingsSlice(...a),
        ...createConfigSlice(initialData, ...a),
      }),
      {
        name: 'user-settings',
        skipHydration: true,
        partialize: (state) => {
          return {
            _customTokens: state._customTokens,
            theme: state.theme,
            language: state.language,
            affiliatePercent: state.affiliatePercent,
            affiliateRef: state.affiliateRef,
            affiliateWallets: state.affiliateWallets,
            slippage: state.slippage,
            customSlippage: state.customSlippage,
            infiniteApprove: state.infiniteApprove,
            preferredBlockchains: state.preferredBlockchains,
            disabledLiquiditySources: state.disabledLiquiditySources,
          };
        },
        version: 1,
        migrate: (persistedState, version) => {
          const state = persistedState as AppStoreState;
          if (version === 0) {
            state._customTokens = state._customTokens.map((token) => ({
              ...token,
              warning: true,
            }));
          }
          return state;
        },
      }
    )
  );
}
