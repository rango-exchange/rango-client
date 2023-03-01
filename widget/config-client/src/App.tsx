import React, { useEffect, useState } from 'react';
import { ConfigType, StyleType } from './types';
import { Spacer, Typography } from '@rangodev/ui';
import { ChainsConfig } from './components/ChainsConfig';
import { WalletsConfig } from './components/WalletsConfig';
import { SourcesConfig } from './components/SourcesConfig';
import { StylesConfig } from './components/StylesConfig';
import { Provider } from '@rangodev/wallets-core';
import { useMetaStore } from './store/meta';
import { allProviders } from '@rangodev/provider-all';

const providers = allProviders();

export function App() {
  const fetchMeta = useMetaStore((state) => state.fetchMeta);

  useEffect(() => {
    (async () => {
      await fetchMeta();
    })();
  }, []);

  const [config, setConfig] = useState<ConfigType>({
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
  });

  const [style, setStyle] = useState<StyleType>({
    title: 'Swap Box',
    width: 525,
    height: 712,
    languege: 'English (uS)',
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
  });
  const { blockchains } = useMetaStore((state) => state.meta);

  const onChangeStyles = (name, value, color) => {
    if (color) {
      setStyle((prev) => ({ ...prev, colors: { ...prev.colors, [name]: value } }));
    } else {
      setStyle((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onChangeConfig = (name, value) => setConfig((prev) => ({ ...prev, [name]: value }));

  return (
    <Provider
      //TDOD : remove any after resloving type conflicts
      allBlockChains={blockchains as any}
      providers={providers}>
      <Typography variant="h1">Configuration</Typography>
      <Spacer size={20} scale="vertical" />
      <ChainsConfig type="Source" config={config} onChange={onChangeConfig} />
      <Spacer size={24} scale="vertical" />
      <ChainsConfig type="Destination" config={config} onChange={onChangeConfig} />
      <Spacer size={24} scale="vertical" />
      <WalletsConfig onChange={onChangeConfig} config={config} />
      <Spacer size={24} scale="vertical" />
      <SourcesConfig onChange={onChangeConfig} config={config} />
      <Spacer size={24} scale="vertical" />
      <StylesConfig onChange={onChangeStyles} style={style} />
    </Provider>
  );
}
