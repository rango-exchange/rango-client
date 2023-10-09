import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

import { DEFAULT_SLIPPAGE } from '../constants/swapSettings';
import { removeDuplicateFrom } from '../utils/common';

import { useMetaStore } from './meta';
import createSelectors from './selectors';

type Theme = 'auto' | 'dark' | 'light';

export interface SettingsState {
  slippage: number;
  customSlippage: number | null;
  infiniteApprove: boolean;
  disabledLiquiditySources: string[];
  theme: Theme;
  affiliateRef: string | null;
  affiliatePercent: number | null;
  affiliateWallets: { [key: string]: string } | null;
  setSlippage: (slippage: number) => void;
  setCustomSlippage: (customSlippage: number | null) => void;
  toggleInfiniteApprove: () => void;
  toggleLiquiditySource: (name: string) => void;
  setTheme: (theme: Theme) => void;
  toggleAllLiquiditySources: (shouldReset?: boolean) => void;
  setAffiliateRef: (affiliateRef: string | null) => void;
  setAffiliatePercent: (affiliatePercent: number | null) => void;
  setAffiliateWallets: (
    affiliateWallets: { [key: string]: string } | null
  ) => void;
}

export const useSettingsStore = createSelectors(
  create<SettingsState>()(
    persist(
      subscribeWithSelector((set) => ({
        slippage: DEFAULT_SLIPPAGE,
        customSlippage: null,
        infiniteApprove: false,
        affiliateRef: null,
        affiliatePercent: null,
        affiliateWallets: null,
        disabledLiquiditySources: [],
        theme: 'auto',
        setSlippage: (slippage) =>
          set(() => ({
            slippage: slippage,
          })),
        setCustomSlippage: (customSlippage) =>
          set(() => ({
            customSlippage: customSlippage,
          })),
        setAffiliateRef: (affiliateRef) =>
          set(() => ({
            affiliateRef,
          })),
        setAffiliatePercent: (affiliatePercent) =>
          set(() => ({
            affiliatePercent,
          })),

        setAffiliateWallets: (affiliateWallets) =>
          set(() => ({
            affiliateWallets,
          })),
        toggleAllLiquiditySources: (shouldReset?: boolean) =>
          set((state) => {
            if (shouldReset) {
              return { disabledLiquiditySources: [] };
            }
            const { swappers } = useMetaStore.getState().meta;
            const swappersGroup = removeDuplicateFrom(
              swappers.map((swapper) => swapper.swapperGroup)
            );

            if (
              swappersGroup.length === state.disabledLiquiditySources.length
            ) {
              return { disabledLiquiditySources: [] };
            }

            return {
              disabledLiquiditySources: swappersGroup,
            };
          }),
        toggleInfiniteApprove: () =>
          set((state) => ({
            infiniteApprove: !state.infiniteApprove,
          })),
        toggleLiquiditySource: (name) =>
          set((state) => {
            if (state.disabledLiquiditySources.includes(name)) {
              return {
                disabledLiquiditySources: state.disabledLiquiditySources.filter(
                  (liquiditySource) => liquiditySource != name
                ),
              };
            }
            return {
              disabledLiquiditySources:
                state.disabledLiquiditySources.concat(name),
            };
          }),
        setTheme: (theme) =>
          set(() => ({
            theme,
          })),
      })),
      {
        name: 'user-settings',
        skipHydration: true,
      }
    )
  )
);
