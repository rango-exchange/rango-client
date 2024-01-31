import type { WidgetConfig } from '../../types';
import type { StateCreatorWithInitialData } from '../app';

export const DEFAULT_CONFIG: WidgetConfig = {
  apiKey: '',
  title: undefined,
  multiWallets: true,
  enableNewLiquiditySources: true,
  customDestination: true,
};

interface IframeConfigs {
  clientUrl?: string;
}

const DEFAULT_IFRAME_CONFIGS: IframeConfigs = {
  clientUrl: undefined,
};

export type ConfigSlice = {
  // What user can set directly.
  config: WidgetConfig;
  updateConfig: (config: WidgetConfig) => void;

  // What we are setting based on enviroments.
  iframe: { clientUrl?: string };
  updateIframe: <K extends keyof IframeConfigs>(
    name: K,
    value: IframeConfigs[K]
  ) => void;
};

export const createConfigSlice: StateCreatorWithInitialData<
  WidgetConfig,
  ConfigSlice,
  ConfigSlice
> = (initialData, set, get) => {
  return {
    config: { ...DEFAULT_CONFIG, ...initialData },
    iframe: DEFAULT_IFRAME_CONFIGS,

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

    updateIframe: (name, value) => {
      const currentIframeConfig = get().iframe;

      set({
        iframe: {
          ...currentIframeConfig,
          [name]: value,
        },
      });
    },
  };
};
