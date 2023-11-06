import { type Language } from '@rango-dev/ui';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

import { BLOCKCHAIN_LIST_SIZE } from '../constants/configs';
import { DEFAULT_LANGUAGE } from '../constants/languages';
import { DEFAULT_SLIPPAGE } from '../constants/swapSettings';
import { removeDuplicateFrom } from '../utils/common';

import { useMetaStore } from './meta';
import createSelectors from './selectors';

export type ThemeMode = 'auto' | 'dark' | 'light';

export interface SettingsState {
  /** Keeping a history of blockchains that user has selected (in Swap process) */
  preferredBlockchains: string[];
  slippage: number;
  customSlippage: number | null;
  infiniteApprove: boolean;
  disabledLiquiditySources: string[];
  theme: ThemeMode;
  language: Language;
  affiliateRef: string | null;
  affiliatePercent: number | null;
  affiliateWallets: { [key: string]: string } | null;

  setSlippage: (slippage: number) => void;
  setCustomSlippage: (customSlippage: number | null) => void;
  toggleInfiniteApprove: () => void;
  toggleLiquiditySource: (name: string) => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  toggleAllLiquiditySources: (shouldReset?: boolean) => void;
  setAffiliateRef: (affiliateRef: string | null) => void;
  setAffiliatePercent: (affiliatePercent: number | null) => void;
  setAffiliateWallets: (
    affiliateWallets: { [key: string]: string } | null
  ) => void;
  addPreferredBlockchain: (blockchain: string) => void;
}

export const useSettingsStore = createSelectors(
  create<SettingsState>()(
    persist(
      subscribeWithSelector((set, get) => ({
        preferredBlockchains: [],
        slippage: DEFAULT_SLIPPAGE,
        customSlippage: null,
        infiniteApprove: false,
        affiliateRef: null,
        affiliatePercent: null,
        affiliateWallets: null,
        disabledLiquiditySources: [],
        theme: 'auto',
        language: DEFAULT_LANGUAGE,
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
        toggleAllLiquiditySources: (shouldReset?: boolean) =>
          set((state) => {
            if (shouldReset) {
              return { disabledLiquiditySources: [] };
            }
            const { swappers } = useMetaStore.getState().meta;
            const swappersGroup = removeDuplicateFrom(
              swappers.map((swapper) => swapper.swapperGroup)
            );

            if (
              swappersGroup.length === state.disabledLiquiditySources.length
            ) {
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
              disabledLiquiditySources:
                state.disabledLiquiditySources.concat(name),
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
      })),
      {
        name: 'user-settings',
        skipHydration: true,
      }
    )
  )
);
