import type { Type } from '../types';
import type { ProviderInterface } from '@rango-dev/wallets-react';
import type { WalletType } from '@rango-dev/wallets-shared';
import type {
  WidgetColors,
  WidgetColorsKeys,
  WidgetConfig,
} from '@rango-dev/widget-embedded';
import type { Asset } from 'rango-sdk';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { getConfig } from '../utils/configs';

import createSelectors from './selectors';

export type Mode = 'dark' | 'light' | 'auto';

interface ConfigState {
  config: WidgetConfig;
  onChangeApiKey: (apiKey: string) => void;
  onChangeWallets: (wallets?: (WalletType | ProviderInterface)[]) => void;
  onChangeSources: (sources?: string[]) => void;
  onChangeBlockChains: (chains?: string[], type?: Type) => void;
  onChangeTokens: (tokens?: Asset[], type?: Type) => void;
  onChangeBooleansConfig: (
    name:
      | 'multiWallets'
      | 'customDestination'
      | 'externalWallets'
      | 'includeNewLiquiditySources',
    value: boolean
  ) => void;
  onChangeBlockChain: (chain?: string, type?: Type) => void;
  onChangeToken: (token?: Asset, type?: Type) => void;
  onChangeAmount: (amount: number) => void;
  onChangeTheme: (
    params:
      | {
          name: 'mode';
          value?: Mode;
        }
      | {
          name: 'borderRadius' | 'secondaryBorderRadius' | 'height' | 'width';
          value?: number;
        }
      | {
          name: 'fontFamily';
          value?: string;
        }
      | {
          name: 'singleTheme';
          value?: boolean;
        }
  ) => void;
  onChangeColors: (
    name: WidgetColorsKeys,
    mode: 'light' | 'dark',
    color?: string
  ) => void;
  onSelectTheme: (colors: { light: WidgetColors; dark: WidgetColors }) => void;
  onChangelanguage: (value: string) => void;
  resetConfig: () => void;
}

export const initialConfig: WidgetConfig = {
  apiKey: getConfig('API_KEY'),
  walletConnectProjectId: getConfig('WC_PROJECT_ID'),
  amount: undefined,
  externalWallets: false,
  from: {
    blockchain: undefined,
    token: undefined,
    blockchains: undefined,
    tokens: undefined,
  },
  to: {
    blockchain: undefined,
    token: undefined,
    blockchains: undefined,
    tokens: undefined,
  },
  liquiditySources: undefined,
  wallets: undefined,
  multiWallets: undefined,
  customDestination: undefined,
  language: undefined,
  includeNewLiquiditySources: undefined,
  theme: {
    mode: 'auto',
    fontFamily: undefined,
    borderRadius: undefined,
    secondaryBorderRadius: undefined,
    width: undefined,
    height: undefined,
    singleTheme: undefined,
    colors: {
      dark: {
        primary: undefined,
        secondary: undefined,
        neutral: undefined,
        background: undefined,
        foreground: undefined,
      },
      light: {
        primary: undefined,
        secondary: undefined,
        neutral: undefined,
        background: undefined,
        foreground: undefined,
      },
    },
  },
};

export const useConfigStore = createSelectors(
  create<ConfigState>()(
    persist(
      immer((set) => ({
        config: initialConfig,
        onChangeApiKey: (apiKey) =>
          set((state) => {
            state.config.apiKey = apiKey;
          }),
        onChangeBlockChains: (chains, type) =>
          set((state) => {
            if (type === 'Source') {
              if (state.config.from) {
                state.config.from.blockchains = chains;
              }
            } else {
              if (state.config.to) {
                state.config.to.blockchains = chains;
              }
            }
          }),
        onChangeTokens: (tokens, type) =>
          set((state) => {
            if (type === 'Source') {
              if (state.config.from) {
                state.config.from.tokens = tokens;
              }
            } else {
              if (state.config.to) {
                state.config.to.tokens = tokens;
              }
            }
          }),
        onChangeBlockChain: (chain, type) =>
          set((state) => {
            if (type === 'Source') {
              if (state.config.from) {
                state.config.from.blockchain = chain;
              }
            } else {
              if (state.config.to) {
                state.config.to.blockchain = chain;
              }
            }
          }),
        onChangeToken: (token, type) =>
          set((state) => {
            if (type === 'Source') {
              if (state.config.from) {
                state.config.from.token = token;
              }
            } else {
              if (state.config.to) {
                state.config.to.token = token;
              }
            }
          }),
        onChangeWallets: (wallets) =>
          set((state) => {
            state.config.wallets = wallets;
          }),
        onChangeSources: (sources) =>
          set((state) => {
            state.config.liquiditySources = sources;
          }),
        onChangeAmount: (amount) =>
          set((state) => {
            state.config.amount = amount;
          }),
        onChangeBooleansConfig: (name, value) =>
          set((state) => {
            state.config[name] = value;
          }),
        onChangelanguage: (value) =>
          set((state) => {
            state.config.language = value as WidgetConfig['language'];
          }),
        onChangeTheme: ({ name, value }) =>
          set((state) => {
            if (state.config.theme) {
              if (name === 'mode') {
                state.config.theme[name] = value;
              } else if (
                name === 'borderRadius' ||
                name === 'secondaryBorderRadius' ||
                name === 'height' ||
                name === 'width'
              ) {
                state.config.theme[name] = value;
              } else if (name === 'fontFamily') {
                state.config.theme[name] = value;
              } else if (name === 'singleTheme') {
                state.config.theme[name] = value;
              }
            }
          }),
        onChangeColors: (name, mode, color) =>
          set((state) => {
            console.log({ color });

            if (state?.config?.theme?.colors) {
              state.config.theme.colors = {
                ...state.config.theme.colors,
                [mode]: {
                  ...state?.config?.theme.colors[mode],
                  [name]: color,
                },
              };
            }
          }),
        onSelectTheme: (colors) =>
          set((state) => {
            if (state.config.theme) {
              state.config.theme.colors = colors;
            }
          }),
        resetConfig: () => {
          set({ config: initialConfig });
        },
      })),
      {
        name: 'user-config',

        partialize: (state) => {
          const { externalWallets, ...config } = state.config;

          return {
            ...state,
            config,
          };
        },
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            const storage = JSON.parse(str as string);

            return {
              state: {
                ...storage.state,
                config: {
                  ...storage.state.config,
                  wallets: storage.state.config.wallets?.filter(
                    (wallet: WalletType | ProviderInterface) =>
                      typeof wallet === 'string'
                  ),
                },
              },
            };
          },
          setItem: (name, newValue) => {
            const str = JSON.stringify({
              state: {
                ...newValue.state,
              },
            });
            localStorage.setItem(name, str);
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
      }
    )
  )
);
