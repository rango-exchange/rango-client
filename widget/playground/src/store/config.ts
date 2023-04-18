import { create } from 'zustand';
import { Asset } from 'rango-sdk';
import createSelectors from './selectors';
import { WalletType } from '@rango-dev/wallets-shared';
import { immer } from 'zustand/middleware/immer';
import { Source, Type, WidgetConfig } from '../types';

export type Mode = 'dark' | 'light' | 'auto';
export type COLORS =
  | 'background'
  | 'inputBackground'
  | 'icons'
  | 'primary'
  | 'secondary'
  | 'text'
  | 'success'
  | 'error'
  | 'warning';

interface ConfigState {
  config: WidgetConfig;
  onChangeWallets: (wallets?: WalletType[]) => void;
  onChangeSources: (sources?: Source[]) => void;
  onChangeBlockChains: (chains?: string[], type?: Type) => void;
  onChangeTokens: (tokens?: Asset[], type?: Type) => void;
  onChangeBooleansConfig: (name: 'multiWallets' | 'customeAddress', value: boolean) => void;
  onChangeBlockChain: (chain?: string, type?: Type) => void;
  onChangeToken: (token?: Asset, type?: Type) => void;
  onChangeAmount: (amount: number) => void;
  onChangeTheme: (
    name: 'mode' | 'fontFamily' | 'borderRadius' | 'width' | 'height',
    value: Mode | string | number,
  ) => void;
  onChangeColors: (name: COLORS, color: string) => void;
  onChangeLanguege: (value: string) => void;
}

export const useConfigStore = createSelectors(
  create<ConfigState>()(
    immer((set) => ({
      config: {
        amount: 0,
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
        multiWallets: true,
        customeAddress: true,
        languege: 'en',
        theme: {
          mode: 'auto',
          fontFamily: 'Roboto',
          borderRadius: 5,
          width: 0,
          height: 0,
          colors: {
            background: '#fff',
            primary: '#5FA425',
            foreground: '#000',
            success: '#0070F3',
            error: '#FF0000',
            warning: '#F5A623',
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
            state.config.from.tokens = tokens;
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
      onChangeLanguege: (value) =>
        set((state) => {
          state.config.languege = value;
        }),
      onChangeTheme: (name, value) =>
        set((state) => {
          state.config.theme[name as string] = value;
        }),
      onChangeColors: (name, color) =>
        set((state) => {
          state.config.theme.colors[name] = color;
        }),
    })),
  ),
);
