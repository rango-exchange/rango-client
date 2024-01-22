import type { ConfigSlice } from './config';
import type { WidgetConfig } from '../../types';
import type { SwapperMeta } from 'rango-sdk';
import type { StateCreator } from 'zustand';

import { type Language } from '@rango-dev/ui';

import { BLOCKCHAIN_LIST_SIZE } from '../../constants/configs';
import { DEFAULT_LANGUAGE } from '../../constants/languages';
import { DEFAULT_SLIPPAGE } from '../../constants/swapSettings';
import { removeDuplicateFrom } from '../../utils/common';
import { isFeatureHidden } from '../../utils/settings';

export type ThemeMode = 'auto' | 'dark' | 'light';

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
}

export const createSettingsSlice: StateCreator<
  SettingsSlice & ConfigSlice,
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
    const { features } = nextConfig;

    const isThemeHidden = isFeatureHidden('theme', features);
    const isLanguageHidden = isFeatureHidden('language', features);
    const isLiquidityHidden = isFeatureHidden('liquiditySource', features);

    set({
      ...(isThemeHidden && { theme: 'auto' }),
      ...(isLanguageHidden && { language: DEFAULT_LANGUAGE }),
      ...(isLiquidityHidden && { disabledLiquiditySources: [] }),
    });
  },
});
