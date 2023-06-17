import { SwapContainer, styled } from '@rango-dev/ui';
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppRouter } from './components/AppRouter';
import { WalletType } from '@rango-dev/wallets-shared';
import { Layout } from './components/Layout';
import { globalFont } from './globalStyles';
import { useTheme } from './hooks/useTheme';
import { WidgetConfig } from './types';
import useSelectLanguage from './hooks/useSelectLanguage';
import './i18n';
import QueueManager from './QueueManager';
import { useUiStore } from './store/ui';
import { navigationRoutes } from './constants/navigationRoutes';
import { initConfig } from './utils/configs';
import { WidgetContext, WidgetWallets } from './Wallets';

const MainContainer = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export type WidgetProps = {
  config?: WidgetConfig;
  /**
   * If `externalWallets` is `true`, you should add `WidgetWallets` to your app.
   * @default false
   */
  externalWallets?: boolean;
};

export function Main(props: PropsWithChildren<WidgetProps>) {
  const { config } = props;
  globalFont(config?.theme?.fontFamily || 'Roboto');

  const { activeTheme } = useTheme(config?.theme || {});
  const { changeLanguage } = useSelectLanguage();
  const [lastConnectedWalletWithNetwork, setLastConnectedWalletWithNetwork] =
    useState<string>('');
  const [disconnectedWallet, setDisconnectedWallet] = useState<WalletType>();
  const currentPage = useUiStore.use.currentPage();
  const widgetContext = useContext(WidgetContext);

  useMemo(() => {
    if (config?.apiKey) {
      initConfig({
        API_KEY: config?.apiKey,
      });
    }
  }, [config]);

  useEffect(() => {
    changeLanguage(config?.language || 'en');
  }, [config?.language]);

  useEffect(() => {
    widgetContext.onConnectWallet(setLastConnectedWalletWithNetwork);
  }, []);

  return (
    <MainContainer id="swap-container" className={activeTheme}>
      <QueueManager>
        <SwapContainer fixedHeight={currentPage !== navigationRoutes.home}>
          <AppRouter
            lastConnectedWallet={lastConnectedWalletWithNetwork}
            disconnectedWallet={disconnectedWallet}
            clearDisconnectedWallet={() => {
              setDisconnectedWallet(undefined);
            }}>
            <Layout config={config} />
          </AppRouter>
        </SwapContainer>
      </QueueManager>
    </MainContainer>
  );
}

export function Widget(props: PropsWithChildren<WidgetProps>) {
  const { externalWallets = false } = props;
  if (!externalWallets) {
    return (
      <WidgetWallets config={props.config?.wallets}>
        <Main {...props} />
      </WidgetWallets>
    );
  }
  return <Main {...props} />;
}
