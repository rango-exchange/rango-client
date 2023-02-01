import { create } from 'zustand';

import { BlockchainMeta } from 'rango-sdk';
import { Token } from 'rango-sdk';
import { immer } from 'zustand/middleware/immer';

type Theme = 'auto' | 'dark' | 'light';

interface Settings {
  slippage: string;
  customSlippage: string;
  infinitApprove: boolean;
  disabledLiquiditySources: string[];
  theme: Theme;
  setSlippage: (slippage: string) => void;
  setCustomSlippage: (customSlippage: string) => void;
  toggleInfinitApprove: () => void;
  toggleLiquiditySource: (name: string) => void;
  setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<Settings>()(
  immer(set => ({
    slippage: '1',
    customSlippage: '',
    infinitApprove: false,
    disabledLiquiditySources: [],
    theme: 'auto',
    setSlippage: slippage =>
      set(state => {
        state.slippage = slippage;
      }),
    setCustomSlippage: customSlippage =>
      set(state => {
        state.customSlippage = customSlippage;
      }),
    toggleInfinitApprove: () =>
      set(state => {
        state.infinitApprove = !state.infinitApprove;
      }),
    toggleLiquiditySource: name =>
      set(state => {
        state.disabledLiquiditySources = state.disabledLiquiditySources.includes(name)
          ? state.disabledLiquiditySources.filter(liquiditySource => liquiditySource === name)
          : state.disabledLiquiditySources.concat(name);
      }),
    setTheme: theme =>
      set(state => {
        state.theme = theme;
      }),
  })),
);
