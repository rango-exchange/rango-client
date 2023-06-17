import { create } from 'zustand';
import { Asset } from 'rango-sdk';
import createSelectors from './selectors';
import { WalletType } from '@rango-dev/wallets-shared';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Type } from '../types';
import { getConfig } from '../configs';
import { WidgetColors, WidgetConfig } from '@rango-dev/widget-embedded';
import { ProviderInterface } from '@rango-dev/wallets-core';

export type Mode = 'dark' | 'light' | 'auto';
export type COLORS =
  | 'background'
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'surface'
  | 'neutral'
  | 'foreground';

interface ConfigState {
  config: WidgetConfig;
  onChangeWallets: (wallets?: (WalletType | ProviderInterface)[]) => void;
  onChangeSources: (sources?: string[]) => void;
  onChangeBlockChains: (chains?: string[], type?: Type) => void;
  onChangeTokens: (tokens?: Asset[], type?: Type) => void;
  onChangeBooleansConfig: (
    name: 'multiWallets' | 'customDestination' | 'externalWallets',
    value: boolean
  ) => void;
  onChangeBlockChain: (chain?: string, type?: Type) => void;
  onChangeToken: (token?: Asset, type?: Type) => void;
  onChangeAmount: (amount: number) => void;
  onChangeTheme: (
    name:
      | 'mode'
      | 'fontFamily'
      | 'borderRadius'
      | 'width'
      | 'height'
      | 'singleTheme',
    value: Mode | string | number | boolean
  ) => void;
  onChangeColors: (
    name: COLORS,
    mode: 'light' | 'dark',
    color?: string
  ) => void;
  onSelectTheme: (colors: { light: WidgetColors; dark: WidgetColors }) => void;
  onChangelanguage: (value: string) => void;
  resetConfig: () => void;
}

export const initialConfig: WidgetConfig = {
  apiKey: getConfig('API_KEY'),
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
  theme: {
    mode: 'auto',
    fontFamily: undefined,
    borderRadius: undefined,
    width: undefined,
    height: undefined,
    singleTheme: undefined,
    colors: {
      dark: {
        background: undefined,
        primary: undefined,
        foreground: undefined,
        success: undefined,
        error: undefined,
        warning: undefined,
        surface: undefined,
        neutral: undefined,
      },
      light: {
        background: undefined,
        primary: undefined,
        foreground: undefined,
        success: undefined,
        error: undefined,
        warning: undefined,
        surface: undefined,
        neutral: undefined,
      },
    },
  },
};

export const useConfigStore = createSelectors(
  create<ConfigState>()(
    persist(
      immer((set) => ({
        config: initialConfig,
        onChangeBlockChains: (chains, type) =>
          set((state) => {
            if (type === 'Source') {
              if (state.config.from) state.config.from.blockchains = chains;
            } else {
              if (state.config.to) state.config.to.blockchains = chains;
            }
          }),
        onChangeTokens: (tokens, type) =>
          set((state) => {
            if (type === 'Source') {
              if (state.config.from) state.config.from.tokens = tokens;
            } else {
              if (state.config.to) state.config.to.tokens = tokens;
            }
          }),
        onChangeBlockChain: (chain, type) =>
          set((state) => {
            if (type === 'Source') {
              if (state.config.from) state.config.from.blockchain = chain;
            } else {
              if (state.config.to) state.config.to.blockchain = chain;
            }
          }),
        onChangeToken: (token, type) =>
          set((state) => {
            if (type === 'Source') {
              if (state.config.from) state.config.from.token = token;
            } else {
              if (state.config.to) state.config.to.token = token;
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
            state.config.language = value;
          }),
        onChangeTheme: (name, value) =>
          set((state) => {
            if (state.config.theme && state.config.theme[name]) {
              switch (name) {
                case 'mode':
                  state.config.theme[name] = value as Mode;
                  return;
                case 'borderRadius':
                case 'height':
                case 'width':
                  state.config.theme[name] = value as number;
                  return;
                case 'fontFamily':
                  state.config.theme[name] = value as string;
                  return;
                case 'singleTheme':
                  state.config.theme[name] = value as boolean;
                  return;
              }
            }
          }),
        onChangeColors: (name, mode, color) =>
          set((state) => {
            if (
              state.config?.theme?.colors &&
              state.config.theme.colors[mode] &&
              state.config.theme.colors[mode][name]
            ) {
              state.config.theme.colors[mode][name] = color;
            }
          }),
        onSelectTheme: (colors) =>
          set((state) => {
            if (state.config.theme) state.config.theme.colors = colors;
          }),
        resetConfig: () => {
          set({ config: initialConfig });
        },
      })),
      {
        name: 'user-config',
        partialize: (state) => ({
          externalWallets: state.config.externalWallets,
        }),
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
