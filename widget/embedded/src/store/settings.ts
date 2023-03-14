import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { DEFAULT_SLIPPAGE } from '../constants/swapSettings';
import { removeDuplicateFrom } from '../utils/common';
import { useMetaStore } from './meta';
import createSelectors from './selectors';

type Theme = 'auto' | 'dark' | 'light';

interface Settings {
  slippage: number;
  customSlippage: number | null;
  infinitApprove: boolean;
  disabledLiquiditySources: string[];
  theme: Theme;
  setSlippage: (slippage: number) => void;
  setCustomSlippage: (customSlippage: number | null) => void;
  toggleInfinitApprove: () => void;
  toggleLiquiditySource: (name: string) => void;
  setTheme: (theme: Theme) => void;
  toggleAllLiquiditySources: () => void;
}

export const useSettingsStore = createSelectors(
  create<Settings>()(
    persist(
      subscribeWithSelector((set) => ({
        slippage: DEFAULT_SLIPPAGE,
        customSlippage: null,
        infinitApprove: false,
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
        toggleAllLiquiditySources: () =>
          set((state) => {
            const { swappers } = useMetaStore.getState().meta;
            const swappersGroup = removeDuplicateFrom(
              swappers.map((swapper) => swapper.swapperGroup)
            );

            if (swappersGroup.length === state.disabledLiquiditySources.length)
              return { disabledLiquiditySources: [] };
            else {
              return {
                disabledLiquiditySources: swappersGroup,
              };
            }
          }),
        toggleInfinitApprove: () =>
          set((state) => ({
            infinitApprove: !state.infinitApprove,
          })),
        toggleLiquiditySource: (name) =>
          set((state) => {
            if (state.disabledLiquiditySources.includes(name))
              return {
                disabledLiquiditySources: state.disabledLiquiditySources.filter(
                  (liquiditySource) => liquiditySource != name
                ),
              };
            else
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
      }
    )
  )
);
