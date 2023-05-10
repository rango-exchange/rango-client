import { create } from 'zustand';
import { Asset } from 'rango-sdk';
import createSelectors from './selectors';
import { WalletType } from '@rango-dev/wallets-shared';
import { immer } from 'zustand/middleware/immer';
import { Type, WidgetConfig } from '../types';
import { getConfig } from '../configs';
import { Colors } from '../types';

export type Mode = 'dark' | 'light' | 'auto';
export type COLORS =
  | 'background'
  | 'inputBackground'
  | 'icons'
  | 'primary'
  | 'text'
  | 'success'
  | 'error'
  | 'warning'
  | 'surface'
  | 'neutral';

interface ConfigState {
  config: WidgetConfig;
  onChangeWallets: (wallets?: WalletType[]) => void;
  onChangeSources: (sources?: string[]) => void;
  onChangeBlockChains: (chains?: string[], type?: Type) => void;
  onChangeTokens: (tokens?: Asset[], type?: Type) => void;
  onChangeBooleansConfig: (name: 'multiWallets' | 'customAddress', value: boolean) => void;
  onChangeBlockChain: (chain?: string, type?: Type) => void;
  onChangeToken: (token?: Asset, type?: Type) => void;
  onChangeAmount: (amount: number) => void;
  onChangeTheme: (
    name: 'mode' | 'fontFamily' | 'borderRadius' | 'width' | 'height' | 'singleTheme',
    value: Mode | string | number | boolean,
  ) => void;
  onChangeColors: (name: COLORS, mode: 'light' | 'dark', color?: string) => void;
  onSelectTheme: (colors: { light: Colors; dark: Colors }) => void;
  onChangelanguage: (value: string) => void;
}

export const useConfigStore = createSelectors(
  create<ConfigState>()(
    immer((set) => ({
      config: {
        apiKey: getConfig('API_KEY'),
        amount: undefined,
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
        customAddress: undefined,
        language: undefined,
        theme: {
          mode: undefined,
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
      },
      onChangeBlockChains: (chains, type) =>
        set((state) => {
          if (type === 'Source') {
            state.config.from.blockchains = chains;
          } else {
            state.config.to.blockchains = chains;
          }
        }),
      onChangeTokens: (tokens, type) =>
        set((state) => {
          if (type === 'Source') {
            state.config.from.tokens = tokens;
          } else {
            state.config.to.tokens = tokens;
          }
        }),
      onChangeBlockChain: (chain, type) =>
        set((state) => {
          if (type === 'Source') {
            state.config.from.blockchain = chain;
          } else {
            state.config.to.blockchain = chain;
          }
        }),
      onChangeToken: (token, type) =>
        set((state) => {
          if (type === 'Source') {
            state.config.from.token = token;
          } else {
            state.config.to.token = token;
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
          state.config.theme[name as string] = value;
        }),
      onChangeColors: (name, mode, color) =>
        set((state) => {
          state.config.theme.colors[mode][name] = color;
        }),
      onSelectTheme: (colors) =>
        set((state) => {
          state.config.theme.colors = colors;
        }),
    })),
  ),
);
