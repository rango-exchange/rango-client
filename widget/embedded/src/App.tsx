<<<<<<< HEAD
import { SwapContainer } from '@rango-dev/ui';
import React from 'react';
import { AppRouter } from './components/AppRouter';
import { useMetaStore } from './store/meta';
import './app.css';
import { Events, Provider } from '@rango-dev/wallets-core';
import { allProviders } from '@rango-dev/provider-all';
import { EventHandler } from '@rango-dev/wallets-core/dist/wallet';
import { isEvmBlockchain, Network } from '@rango-dev/wallets-shared';
import { prepareAccountsForWalletStore, walletAndSupportedChainsNames } from './utils/wallets';
import { useWalletsStore } from './store/wallets';
import { Layout } from './components/Layout';
import { globalStyles } from './globalStyles';
import { useTheme } from './hooks/useTheme';

const providers = allProviders();
interface Token {
  name: string;
  contractAddress?: string;
}

//todo: update interface and update widget state based on WidgetProps change
export type WidgetProps = {
  fromChain?: string;
  fromToken?: string;
  toChain?: string;
  toToken?: string;
  fromAmount?: string;
  slippage?: number;
  chains?: string[];
  tokens?: Token[];
  liquiditySources?: string[];
  theme: 'dark' | 'light' | 'auto';
};

export function App() {
  globalStyles();
  const { activeTheme } = useTheme();
  const { blockchains } = useMetaStore.use.meta();
  const disconnectWallet = useWalletsStore.use.disconnectWallet();
  const connectWallet = useWalletsStore.use.connectWallet();
  const evmBasedChainNames = blockchains
    //@ts-ignore
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  const onUpdateState: EventHandler = (type, event, value, state, supportedChains) => {
    if (event === Events.ACCOUNTS) {
      if (value) {
        const supportedChainNames: Network[] | null =
          //@ts-ignore
          walletAndSupportedChainsNames(supportedChains);
        const data = prepareAccountsForWalletStore(
          type,
          value,
          evmBasedChainNames,
          supportedChainNames,
        );
        connectWallet(data);
      } else {
        disconnectWallet(type);
      }
    }
  };

  return (
    //@ts-ignore
    <Provider allBlockChains={blockchains} providers={providers} onUpdateState={onUpdateState}>
      <div id="pageContainer" className={activeTheme}>
        <SwapContainer>
          <AppRouter>
            <Layout />
          </AppRouter>
        </SwapContainer>
      </div>
    </Provider>
=======
import { Spacer, styled, SwapContainer } from '@rangodev/ui';
import React, { useState } from 'react';
import { Config } from './components/config';
import { ConfigType, StyleType } from './types/config';
const Container = styled('div', {
  display: 'flex',
  backgroundColor: '$neutrals300',
  padding: 10,
  justifyContent: 'center',
});

const SwapBox = styled(SwapContainer, {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '$36',
  flex: 1,
  marginTop: '6.5%',
});

export function App() {
  const [config, setConfig] = useState<ConfigType>({
    fromChain: 'Polygon',
    fromToken: 'USDT',
    toChain: 'BSC',
    toToken: 'USDT',
    fromAmount: '0',
    chains: ['BSC'],
    tokens: ['USDT'],
    liquiditySources: ['Acros'],
    theme: 'auto',
    wallets: ['metamask', 'xdefi'],
    multiChain: true,
    customeAddress: true,
  });

  const [style, setStyle] = useState<StyleType>({
    title: 'Swap Box',
    width: '525',
    height: '712',
    languege: 'English',
    borderRadius: '5',
    fontFaminy: 'Roboto',
    titleSize: '48',
    titelsWeight: '700',
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
  });

  const onChangeStyles = (name, value, color) => {
    if (color) {
      setStyle((prev) => ({ ...prev, colors: { ...prev.colors, [name]: value } }));
    } else {
      setStyle((prev) => ({ ...prev, [name]: value }));
    }
  };
  return (
    <Container>
      <Config onChangeStyles={onChangeStyles} style={style} config={config} />
      <Spacer size={24} />
      <SwapBox>{style.title}</SwapBox>
    </Container>
>>>>>>> deaf27d (update config component)
  );
}
