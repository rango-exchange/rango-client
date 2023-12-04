import type { PropTypes, Ref } from './Layout.types';
import type { PropsWithChildren } from 'react';

import { BottomLogo, Divider, Header } from '@rango-dev/ui';
import React from 'react';

import { useNavigateBack } from '../../hooks/useNavigateBack';
import { useAppStore } from '../../store/AppStore';
import { useUiStore } from '../../store/ui';
import { useWalletsStore } from '../../store/wallets';
import { getContainer } from '../../utils/common';
import { isFeatureHidden } from '../../utils/settings';
import { BackButton, CancelButton, WalletButton } from '../HeaderButtons';

import { Container, Content, Footer } from './Layout.styles';

function LayoutComponent(props: PropsWithChildren<PropTypes>, ref: Ref) {
  const {
    children,
    header,
    footer,
    noPadding,
    hasLogo = true,
    fixedHeight = true,
  } = props;
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const {
    config: { features },
  } = useAppStore();

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

  return (
    <Container ref={ref} fixedHeight={fixedHeight} id="swap-box">
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
      <Content noPadding={noPadding}>{children}</Content>
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

const Layout = React.forwardRef(LayoutComponent);
Layout.displayName = 'Layout';

export { Layout };
