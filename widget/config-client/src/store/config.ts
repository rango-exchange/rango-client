import { create } from 'zustand';
import { BlockchainMeta, Token } from 'rango-sdk';
import createSelectors from './selectors';
import { LiquiditySource } from '@rango-dev/ui/dist/types/meta';
import { WalletType } from '@rango-dev/wallets-shared';
import { immer } from 'zustand/middleware/immer';
import { Type } from '../types';
export type StringsName = 'title' | 'languege' | 'fontFaminy';

export type NumbersName =
  | 'width'
  | 'fromAmount'
  | 'height'
  | 'borderRadius'
  | 'titleSize'
  | 'titelsWeight';

export type THEME = 'dark' | 'light' | 'auto';
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
  configs: {
    fromChain: BlockchainMeta | null;
    fromToken: Token | null;
    toChain: BlockchainMeta | null;
    toToken: Token | null;
    fromAmount: number;
    fromChains: 'all' | BlockchainMeta[];
    fromTokens: 'all' | Token[];
    toChains: 'all' | BlockchainMeta[];
    toTokens: 'all' | Token[];
    liquiditySources: 'all' | LiquiditySource[];
    wallets: 'all' | WalletType[];
    multiChain: boolean;
    customeAddress: boolean;
    theme: THEME;
    title: string;
    width: number;
    height: number;
    languege: string;
    borderRadius: number;
    fontFaminy: string;
    titleSize: number;
    titelsWeight: number;
    colors: {
      background: string;
      inputBackground: string;
      icons: string;
      primary: string;
      secondary: string;
      text: string;
      success: string;
      error: string;
      warning: string;
    };
  };
  onChangeWallets: (wallets: WalletType[] | 'all') => void;
  onChangeSources: (sources: LiquiditySource[] | 'all') => void;
  onChangeBlockChains: (chains: BlockchainMeta[] | 'all', type: Type) => void;
  onChangeTokens: (tokens: Token[] | 'all', type: Type) => void;
  onChangeBooleansConfig: (name: 'multiChain' | 'customeAddress', value: boolean) => void;
  onChangeBlockChain: (chain: BlockchainMeta, type: Type) => void;
  onChangeToken: (token: Token, type: Type) => void;
  onChangeStringsConfig: (name: StringsName, value: string) => void;
  onChangeNumbersConfig: (name: NumbersName, value: number) => void;
  onChangeTheme: (theme: THEME) => void;
  onChangeColors: (name: COLORS, color: string) => void;
}

export const useConfigStore = createSelectors(
  create<ConfigState>()(
    immer((set) => ({
      configs: {
        fromChain: null,
        fromToken: null,
        toChain: null,
        toToken: null,
        fromAmount: 0,
        fromChains: 'all',
        fromTokens: 'all',
        toChains: 'all',
        toTokens: 'all',
        liquiditySources: 'all',
        wallets: 'all',
        multiChain: true,
        customeAddress: true,
        title: 'Swap Box',
        width: 525,
        height: 712,
        languege: 'English (US)',
        borderRadius: 5,
        theme: 'auto',
        fontFaminy: 'Roboto',
        titleSize: 48,
        titelsWeight: 700,
        colors: {
          background: '#ECF3F4',
          inputBackground: '#FFFFFF',
          icons: '#10150F',
          primary: '#5FA425',
          secondary: '#CDCDCD',
          text: '#0E1617',
          success: '#0AA65B',
          error: '#DE0700',
          warning: '#FFD771',
        },
      },
      onChangeBlockChains: (chains, type) =>
        set((state) => {
          if (type === 'Source') {
            state.configs.fromChains = chains;
          } else {
            state.configs.toChains = chains;
          }
        }),
      onChangeTokens: (tokens, type) =>
        set((state) => {
          if (type === 'Source') {
            state.configs.fromTokens = tokens;
          } else {
            state.configs.toTokens = tokens;
          }
        }),
      onChangeBlockChain: (chain, type) =>
        set((state) => {
          if (type === 'Source') {
            state.configs.fromChain = chain;
          } else {
            state.configs.toChain = chain;
          }
        }),
      onChangeToken: (token, type) =>
        set((state) => {
          if (type === 'Source') {
            state.configs.fromToken = token;
          } else {
            state.configs.toToken = token;
          }
        }),
      onChangeWallets: (wallets) =>
        set((state) => {
          state.configs.wallets = wallets;
        }),
      onChangeSources: (sources) =>
        set((state) => {
          state.configs.liquiditySources = sources;
        }),
      onChangeBooleansConfig: (name, value) =>
        set((state) => {
          state.configs[name] = value;
        }),
      onChangeStringsConfig: (name, value) =>
        set((state) => {
          state.configs[name] = value;
        }),
      onChangeNumbersConfig: (name, value) =>
        set((state) => {
          state.configs[name] = value;
        }),
      onChangeTheme: (theme) =>
        set((state) => {
          state.configs.theme = theme;
        }),
      onChangeColors: (name, color) =>
        set((state) => {
          state.configs.colors[name] = color;
        }),
    })),
  ),
);
