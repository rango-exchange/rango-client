import { create } from 'zustand';
import createSelectors from './selectors';
import { immer } from 'zustand/middleware/immer';
import { Configs } from '../types';
export type StringsName = 'title' | 'languege' | 'fontFaminy';

interface ConfigState {
  configs: Configs;
  onChangeconfigs: (configs: Configs) => void;
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
      onChangeconfigs: (configs) =>
        set((state) => {
          state.configs = configs;
        }),
    }))
  )
);
