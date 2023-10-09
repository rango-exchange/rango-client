import type { PropTypes, Ref } from './Layout.types';
import type { PropsWithChildren } from 'react';

import { BottomLogo, Divider, Header } from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { useUiStore } from '../../store/ui';
import { useWalletsStore } from '../../store/wallets';
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

  const connectWalletsButtonDisabled =
    useUiStore.use.connectWalletsButtonDisabled();
  const navigate = useNavigate();

  const onConnectWallet = () => {
    if (!connectWalletsButtonDisabled) {
      navigate('/' + navigationRoutes.wallets);
    }
  };
  return (
    <Container ref={ref} fixedHeight={fixedHeight} id="swap-box">
      <Header
        prefix={<>{header.onBack && <BackButton onClick={header.onBack} />}</>}
        title={header.title}
        suffix={
          <>
            {header.suffix}
            {header.hasConnectWallet && (
              <WalletButton
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
