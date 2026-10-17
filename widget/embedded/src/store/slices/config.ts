import type { DataSlice } from './data';
import type { SettingsSlice } from './settings';
import type {
  WidgetConfig,
  WidgetConfigWithoutLegacyProviders,
} from '../../types';
import type { StateCreatorWithInitialData } from '../app';
import type { Provider } from '@hub3js/core';

import {
  allProviders as getAllProviders,
  WalletTypes,
} from '@rango-dev/provider-all';

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

export const DEFAULT_CONFIG: WidgetConfigWithoutLegacyProviders = {
  apiKey: '',
  title: undefined,
  multiWallets: true,
  excludeLiquiditySources: true,
  customDestination: true,
  variant: 'default',
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
  config: WidgetConfigWithoutLegacyProviders;
  campaignMode: CampaignMode;
  isInCampaignMode: () => boolean;
  getLiquiditySources: () => string[];
  getDisabledLiquiditySources: () => string[];
  excludeLiquiditySources: () => boolean;
  updateConfig: (config: WidgetConfigWithoutLegacyProviders) => void;
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
  allProviders: Provider[];
  buildAndSetProviders: () => void;
  getAvailableProviders: () => Provider[];
}

function generateProviders(
  config: WidgetConfigWithoutLegacyProviders
): Provider[] {
  const allProviders = getAllProviders();
  const allBuiltProviders = allProviders.map((build) => build());

  return allBuiltProviders.filter((provider) =>
    hasRequiredConfig(provider.id, config)
  );
}

const REQUIRED_CONFIG_BY_WALLET: Partial<
  Record<string, keyof WidgetConfigWithoutLegacyProviders>
> = {
  [WalletTypes.LEDGER_WALLET]: 'ledgerWallet',
  [WalletTypes.TREZOR]: 'trezorManifest',
  [WalletTypes.TON_CONNECT]: 'tonConnect',
  [WalletTypes.WALLET_CONNECT_2]: 'walletConnectProjectId',
};

function hasRequiredConfig(
  walletId: string,
  config: WidgetConfigWithoutLegacyProviders
): boolean {
  const requiredKey = REQUIRED_CONFIG_BY_WALLET[walletId];
  if (!requiredKey || config[requiredKey]) {
    return true;
  }

  console.warn(
    `${walletId} is listed in config wallets but ${requiredKey} config is not provided!`
  );
  return false;
}

export const createConfigSlice: StateCreatorWithInitialData<
  WidgetConfigWithoutLegacyProviders,
  ConfigSlice & SettingsSlice & DataSlice,
  ConfigSlice
> = (initialData, set, get) => {
  const config: WidgetConfigWithoutLegacyProviders = {
    ...DEFAULT_CONFIG,
    ...initialData,
  };
  const allBuiltProviders = generateProviders(config);
  return {
    config,
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
    updateConfig: (nextConfig: WidgetConfigWithoutLegacyProviders) => {
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
