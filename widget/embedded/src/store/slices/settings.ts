import type { ConfigSlice } from './config';
import type { DataSlice } from './data';
import type { WalletsSlice } from './wallets';
import type { TokenData } from '../../components/TokenList/TokenList.types';
import type { WidgetConfig } from '../../types';
import type { SwapperMeta, Token } from 'rango-sdk';
import type { StateCreator } from 'zustand';

import { type Language } from '@arlert-dev/ui';

import { BLOCKCHAIN_LIST_SIZE } from '../../constants/configs';
import { DEFAULT_LANGUAGE } from '../../constants/languages';
import { DEFAULT_SLIPPAGE } from '../../constants/swapSettings';
import { removeDuplicateFrom } from '../../utils/common';
import { isFeatureHidden } from '../../utils/settings';
import { getSupportedBlockchainsFromConfig } from '../utils';

export type ThemeMode = 'auto' | 'dark' | 'light';
export type QuoteTokensRate = 'default' | 'reversed';

export interface SettingsSlice {
  theme: ThemeMode;
  language: Language | null;
  disabledLiquiditySources: string[];
  /** Keeping a history of blockchains that user has selected (in Swap process) */
  preferredBlockchains: string[];
  slippage: number;
  customSlippage: number | null;
  infiniteApprove: boolean;
  affiliateRef: string | null;
  affiliatePercent: number | null;
  affiliateWallets: { [key: string]: string } | null;
  _customTokens: Token[];
  quoteTokensRate: QuoteTokensRate;

  setSlippage: (slippage: number) => void;
  setCustomSlippage: (customSlippage: number | null) => void;
  toggleInfiniteApprove: () => void;
  toggleLiquiditySource: (name: string) => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language | null) => void;
  toggleAllLiquiditySources: (
    swappers: SwapperMeta[],
    shouldReset?: boolean
  ) => void;
  setAffiliateRef: (affiliateRef: string | null) => void;
  setAffiliatePercent: (affiliatePercent: number | null) => void;
  setAffiliateWallets: (
    affiliateWallets: { [key: string]: string } | null
  ) => void;
  addPreferredBlockchain: (blockchain: string) => void;
  updateSettings: (config: WidgetConfig) => void;
  setCustomToken: (token: TokenData) => void;
  deleteCustomToken: (token: Token) => void;
  customTokens: () => Token[];
  changeQuoteTokensRate: () => void;
}

export const createSettingsSlice: StateCreator<
  SettingsSlice & DataSlice & ConfigSlice & WalletsSlice,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  disabledLiquiditySources: [],
  theme: 'auto',
  language: null,
  preferredBlockchains: [],
  slippage: DEFAULT_SLIPPAGE,
  customSlippage: null,
  infiniteApprove: false,
  affiliateRef: null,
  affiliatePercent: null,
  affiliateWallets: null,
  _customTokens: [],
  quoteTokensRate: 'default',

  changeQuoteTokensRate: () =>
    set((state) => ({
      quoteTokensRate:
        state.quoteTokensRate === 'default' ? 'reversed' : 'default',
    })),
  addPreferredBlockchain: (blockchain) => {
    const currentPreferredBlockchains = get().preferredBlockchains;

    const noNeedToDoAnything = currentPreferredBlockchains.find(
      (preferredBlockchain, index) => {
        const isSameBlockchain = preferredBlockchain === blockchain;
        const isInVisibleList = index <= BLOCKCHAIN_LIST_SIZE - 1;

        return isSameBlockchain && isInVisibleList;
      }
    );

    if (noNeedToDoAnything) {
      return;
    }

    const nextPreferredBlockchains: string[] =
      currentPreferredBlockchains.filter((preferredBlockchain) => {
        const isSameBlockchain = preferredBlockchain === blockchain;

        return !isSameBlockchain;
      });

    set(() => ({
      preferredBlockchains: [blockchain, ...nextPreferredBlockchains],
    }));
  },
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
  toggleAllLiquiditySources: (swappers, shouldReset) =>
    set((state) => {
      if (shouldReset) {
        return { disabledLiquiditySources: [] };
      }
      const swappersGroup = removeDuplicateFrom(
        swappers.map((swapper) => swapper.swapperGroup)
      );

      if (swappersGroup.length === state.disabledLiquiditySources.length) {
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
        disabledLiquiditySources: state.disabledLiquiditySources.concat(name),
      };
    }),
  setTheme: (theme) =>
    set(() => ({
      theme,
    })),
  setLanguage: (language) =>
    set(() => ({
      language,
    })),
  updateSettings: (nextConfig: WidgetConfig) => {
    const { features, theme } = nextConfig;

    const isThemeHidden = isFeatureHidden('theme', features);
    const isLanguageHidden = isFeatureHidden('language', features);
    const isLiquidityHidden = isFeatureHidden('liquiditySource', features);
    const singleTheme = theme?.singleTheme;
    const autoUpdateSettings =
      nextConfig?.__UNSTABLE_OR_INTERNAL__?.autoUpdateSettings;

    set({
      ...(isThemeHidden && { theme: nextConfig.theme?.mode || 'auto' }),
      ...(singleTheme && { theme: nextConfig.theme?.mode || 'light' }),
      ...(isLanguageHidden && {
        language: nextConfig.language || DEFAULT_LANGUAGE,
      }),
      ...(isLiquidityHidden && {
        disabledLiquiditySources: nextConfig.liquiditySources || [],
      }),
      ...(autoUpdateSettings && {
        // For the time being, we have added the language; if more are needed later, we can add other parameters.
        language: nextConfig.language || DEFAULT_LANGUAGE,
      }),
    });
  },
  setCustomToken: (token) => {
    void get().fetchCustomTokensBalances({
      tokens: [token],
      connectedWallets: get().connectedWallets,
    });
    set((state) => ({
      _customTokens: [token, ...state._customTokens],
    }));
  },
  deleteCustomToken: (token) =>
    set((state) => ({
      _customTokens: state._customTokens.filter(
        (customToken) => customToken.address !== token.address
      ),
    })),
  customTokens: () => {
    const config = get().config;

    const customTokens = get()._customTokens;
    const supportedBlockchainsFromConfig = getSupportedBlockchainsFromConfig({
      config,
    });

    return !supportedBlockchainsFromConfig.length
      ? customTokens
      : customTokens.filter((token) =>
          supportedBlockchainsFromConfig.includes(token.blockchain)
        );
  },
});
