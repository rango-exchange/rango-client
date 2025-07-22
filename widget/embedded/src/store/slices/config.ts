import type { DataSlice } from './data';
import type { SettingsSlice } from './settings';
import type { WidgetConfig } from '../../types';
import type { StateCreatorWithInitialData } from '../app';

import { allProviders as getAllProviders } from '@arlert-dev/provider-all';
import { type VersionedProviders } from '@arlert-dev/wallets-core';

import { cacheService } from '../../services/cacheService';
import {
  matchAndGenerateProviders,
  type ProvidersOptions,
} from '../../utils/providers';
import { matchTokensFromConfigWithMeta } from '../utils';

function makeProvidersOptionsFromConfig(
  config: WidgetConfig
): ProvidersOptions {
  const options: ProvidersOptions = {
    walletConnectProjectId: config?.walletConnectProjectId,
    trezorManifest: config?.trezorManifest,
    tonConnect: config?.tonConnect,
    walletConnectListedDesktopWalletLink:
      config.__UNSTABLE_OR_INTERNAL__?.walletConnectListedDesktopWalletLink,
  };

  return options;
}

export const DEFAULT_CONFIG: WidgetConfig = {
  apiKey: '',
  title: undefined,
  multiWallets: true,
  excludeLiquiditySources: true,
  customDestination: true,
  variant: 'default',
  trezorManifest: {
    appUrl: 'https://widget.rango.exchange/',
    email: 'hi+trezorwidget@rango.exchange',
  },
  tonConnect: {
    manifestUrl:
      'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/manifests/tonconnect-manifest.json',
  },
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
  allProviders: VersionedProviders[];
  buildAndSetProviders: () => void;
  getAvailableProviders: () => VersionedProviders[];
}

function generateProviders(config: WidgetConfig) {
  const options = makeProvidersOptionsFromConfig(config);
  const envs = {
    walletconnect2: {
      WC_PROJECT_ID: options?.walletConnectProjectId || '',
      DISABLE_MODAL_AND_OPEN_LINK:
        options?.walletConnectListedDesktopWalletLink,
    },
    selectedProviders: config.wallets,
    trezor: options?.trezorManifest
      ? { manifest: options.trezorManifest }
      : undefined,
    tonConnect: options?.tonConnect?.manifestUrl
      ? { manifestUrl: options?.tonConnect.manifestUrl }
      : undefined,
  };
  const allProviders = getAllProviders(envs);
  const allBuiltProviders = allProviders.map((build) => build());

  return allBuiltProviders;
}

export const createConfigSlice: StateCreatorWithInitialData<
  WidgetConfig,
  ConfigSlice & SettingsSlice & DataSlice,
  ConfigSlice
> = (initialData, set, get) => {
  const allBuiltProviders = generateProviders({
    ...DEFAULT_CONFIG,
    ...initialData,
  });
  return {
    config: { ...DEFAULT_CONFIG, ...initialData },
    iframe: DEFAULT_IFRAME_CONFIGS,
    campaignMode: DEFAULT_CAMPAIGN_MODE,
    allProviders: allBuiltProviders,
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
        : !!config.excludeLiquiditySources;
    },
    isInCampaignMode: () => {
      const { campaignMode } = get();
      return !!campaignMode.liquiditySources?.length;
    },

    // Actions
    updateConfig: (nextConfig: WidgetConfig) => {
      const currentConfig = get().config;
      const {
        _tokensMapByTokenHash: tokensMapByTokenHash,
        _tokensMapByBlockchainName: tokensMapByBlockchainName,
      } = get();

      const supportedSourceTokens = matchTokensFromConfigWithMeta({
        type: 'source',
        config: {
          blockchains: nextConfig.from?.blockchains,
          tokens: nextConfig.from?.tokens,
        },
        meta: {
          tokensMapByBlockchainName,
          tokensMapByTokenHash,
        },
      });

      const supportedDestinationTokens = matchTokensFromConfigWithMeta({
        type: 'destination',
        config: {
          blockchains: nextConfig.to?.blockchains,
          tokens: nextConfig.to?.tokens,
        },
        meta: {
          tokensMapByBlockchainName,
          tokensMapByTokenHash,
        },
      });

      cacheService.set('supportedSourceTokens', supportedSourceTokens);
      cacheService.set(
        'supportedDestinationTokens',
        supportedDestinationTokens
      );

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

    buildAndSetProviders: () => {
      const { config } = get();
      const allBuiltProviders = generateProviders(config);

      set({
        allProviders: allBuiltProviders,
      });
    },

    getAvailableProviders: () => {
      const { allProviders, config } = get();
      const options = makeProvidersOptionsFromConfig(config);

      const availableProviders = matchAndGenerateProviders({
        allProviders,
        configWallets: config.wallets,
        options,
      });
      return availableProviders;
    },
  };
};
