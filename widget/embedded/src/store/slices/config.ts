import type { WidgetConfig } from '../../types';
import type { StateCreator } from 'zustand';

const initConfig: WidgetConfig = { apiKey: '' };

export type ConfigSlice = {
  config: WidgetConfig;

  updateConfig: (config: WidgetConfig) => void;
};

export const createConfigSlice: StateCreator<ConfigSlice> = (set, get) => ({
  config: initConfig,

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
});
