import type { SettingsSlice } from './settings';
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

interface CampaignMode {
  liquiditySources?: string[];
}

const DEFAULT_IFRAME_CONFIGS: IframeConfigs = {
  clientUrl: undefined,
};

const DEFAULT_CAMPAIGN_MODE: CampaignMode = {
  liquiditySources: undefined,
};

export interface ConfigSlice {
  // What user can set directly.
  config: WidgetConfig;
  campaignMode: CampaignMode;
  isInCampaignMode: () => boolean;
  getLiquiditySources: () => string[];
  getDisabledLiquiditySources: () => string[];
  excludeLiquiditySources: () => boolean;
  updateConfig: (config: WidgetConfig) => void;
  updateCampaignMode: <K extends keyof CampaignMode>(
    name: K,
    value: CampaignMode[K]
  ) => void;
  // What we are setting based on environments.
  iframe: { clientUrl?: string };
  updateIframe: <K extends keyof IframeConfigs>(
    name: K,
    value: IframeConfigs[K]
  ) => void;
}

export const createConfigSlice: StateCreatorWithInitialData<
  WidgetConfig,
  ConfigSlice & SettingsSlice,
  ConfigSlice
> = (initialData, set, get) => {
  return {
    config: { ...DEFAULT_CONFIG, ...initialData },
    iframe: DEFAULT_IFRAME_CONFIGS,
    campaignMode: DEFAULT_CAMPAIGN_MODE,
    getLiquiditySources: () => {
      const { config, campaignMode } = get();
      return campaignMode.liquiditySources?.length
        ? campaignMode.liquiditySources
        : config.liquiditySources ?? [];
    },
    getDisabledLiquiditySources: () => {
      const { disabledLiquiditySources, campaignMode } = get();
      return campaignMode.liquiditySources?.length
        ? []
        : disabledLiquiditySources;
    },
    excludeLiquiditySources: () => {
      const { config, campaignMode } = get();
      return campaignMode.liquiditySources?.length
        ? false
        : !!config.enableNewLiquiditySources;
    },
    isInCampaignMode: () => {
      const { campaignMode } = get();
      return !!campaignMode.liquiditySources?.length;
    },

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

    updateCampaignMode: (name, value) => {
      const currentCampaignMode = get().campaignMode;

      set({
        campaignMode: {
          ...currentCampaignMode,
          [name]: value,
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
