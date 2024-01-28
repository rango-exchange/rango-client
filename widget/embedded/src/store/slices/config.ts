import type { WidgetConfig } from '../../types';
import type { StateCreatorWithInitialData } from '../app';

export const DEFAULT_CONFIG: WidgetConfig = {
  apiKey: '',
  title: undefined,
  multiWallets: true,
  enableNewLiquiditySources: true,
  customDestination: true,
};

export type ConfigSlice = {
  config: WidgetConfig;

  updateConfig: (config: WidgetConfig) => void;
};

export const createConfigSlice: StateCreatorWithInitialData<
  WidgetConfig,
  ConfigSlice,
  ConfigSlice
> = (initialData, set, get) => {
  return {
    config: { ...DEFAULT_CONFIG, ...initialData },

    // Actions
    updateConfig: (nextConfig: WidgetConfig) => {
      const currentConfig = get().config;

      set({
        config: {
          ...currentConfig,
          ...nextConfig,
        },
      });
    },
  };
};
