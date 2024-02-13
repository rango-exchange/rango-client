import type { ConfigSlice } from './slices/config';
import type { DataSlice } from './slices/data';
import type { SettingsSlice } from './slices/settings';
import type { WidgetConfig } from '../types';
import type { StateCreator } from 'zustand';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createConfigSlice } from './slices/config';
import { createDataSlice } from './slices/data';
import { createSettingsSlice } from './slices/settings';

export type StateCreatorWithInitialData<
  T extends Partial<WidgetConfig>,
  R extends Partial<AppStoreState>,
  V extends Partial<AppStoreState>
> = (
  initialData: T | undefined,
  ...rest: Parameters<StateCreator<R, [], [], V>>
) => ReturnType<StateCreator<R, [], [], V>>;

export type AppStoreState = DataSlice & ConfigSlice & SettingsSlice;

export function createAppStore(initialData?: WidgetConfig) {
  return create<AppStoreState>()(
    persist(
      (...a) => ({
        ...createDataSlice(...a),
        ...createSettingsSlice(...a),
        ...createConfigSlice(initialData, ...a),
      }),
      {
        name: 'user-settings',
        skipHydration: true,
        partialize: (state) => {
          return {
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
      }
    )
  );
}
