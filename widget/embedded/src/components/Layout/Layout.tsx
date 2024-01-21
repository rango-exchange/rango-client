import type { PropTypes } from './Layout.types';
import type { PropsWithChildren } from 'react';

import { BottomLogo, Divider, Header } from '@rango-dev/ui';
import React, { useEffect, useRef } from 'react';

import { RANGO_SWAP_BOX_ID } from '../../constants';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';
import { useUiStore } from '../../store/ui';
import { useWalletsStore } from '../../store/wallets';
import { getContainer } from '../../utils/common';
import { isFeatureHidden } from '../../utils/settings';
import { BackButton, CancelButton, WalletButton } from '../HeaderButtons';

import { onScrollContentAttachStatusToContainer } from './Layout.helpers';
import { Container, Content, Footer } from './Layout.styles';

function Layout(props: PropsWithChildren<PropTypes>) {
  const { children, header, footer, hasLogo = true, height = 'fixed' } = props;
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const {
    config: { features, theme },
  } = useAppStore();
  const { activeTheme } = useTheme(theme || {});

  const isConnectWalletHidden = isFeatureHidden(
    'connectWalletButton',
    features
  );

  const connectWalletsButtonDisabled =
    useUiStore.use.connectWalletsButtonDisabled();
  const navigateBack = useNavigateBack();

  const onConnectWallet = () => {
    if (!connectWalletsButtonDisabled && header.onWallet) {
      header.onWallet();
    }
  };

  const showBackButton =
    typeof header.hasBackButton === 'undefined' || header.hasBackButton;

  const scrollViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollViewRef.current?.addEventListener(
      'scroll',
      onScrollContentAttachStatusToContainer
    );

    return () => {
      scrollViewRef.current?.removeEventListener(
        'scroll',
        onScrollContentAttachStatusToContainer
      );
    };
  }, []);

  return (
    <Container height={height} id={RANGO_SWAP_BOX_ID} className={activeTheme()}>
      <Header
        prefix={<>{showBackButton && <BackButton onClick={navigateBack} />}</>}
        title={header.title}
        suffix={
          <>
            {header.suffix}
            {header.onWallet && !isConnectWalletHidden && (
              <WalletButton
                container={getContainer()}
                onClick={onConnectWallet}
                isConnected={!!connectedWallets?.length}
              />
            )}
            {header.onCancel && <CancelButton onClick={header.onCancel} />}
          </>
        }
      />
      <Content ref={scrollViewRef}>{children}</Content>
      {(hasLogo || footer) && (
        <Footer>
          <div className="footer__content">{footer}</div>
          {hasLogo && (
            <div className="footer__logo">
              <Divider size={12} />
              <BottomLogo />
            </div>
          )}
        </Footer>
      )}
    </Container>
  );
}
export { Layout };
