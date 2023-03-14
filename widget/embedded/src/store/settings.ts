import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
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
      immer(
        subscribeWithSelector((set) => ({
          slippage: 1,
          customSlippage: null,
          infinitApprove: false,
          disabledLiquiditySources: [],
          theme: 'auto',
          setSlippage: (slippage) =>
            set((state) => {
              state.slippage = slippage;
            }),
          setCustomSlippage: (customSlippage) => {
            return set((state) => {
              state.customSlippage = customSlippage;
            });
          },
          toggleAllLiquiditySources: () =>
            set((state) => {
              const { swappers } = useMetaStore.getState().meta;

              if (swappers.length - state.disabledLiquiditySources.length === 0)
                state.disabledLiquiditySources = [];
              else {
                const allSwappers = swappers.map((swapper) => swapper.swapperGroup);
                state.disabledLiquiditySources = allSwappers;
              }
            }),
          toggleInfinitApprove: () =>
            set((state) => {
              state.infinitApprove = !state.infinitApprove;
            }),
          toggleLiquiditySource: (name) =>
            set((state) => {
              state.disabledLiquiditySources = state.disabledLiquiditySources.includes(name)
                ? state.disabledLiquiditySources.filter(
                    (liquiditySource) => liquiditySource != name,
                  )
                : state.disabledLiquiditySources.concat(name);
            }),
          setTheme: (theme) =>
            set((state) => {
              state.theme = theme;
            }),
        })),
      ),
      {
        name: 'user-settings',
      },
    ),
  ),
);
