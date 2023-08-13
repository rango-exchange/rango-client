import type { PropTypes } from './Layout.types';
import type { PropsWithChildren } from 'react';

import { BottomLogo, Header } from '@rango-dev/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { useUiStore } from '../../store/ui';
import { BackButton, CancelButton, WalletButton } from '../HeaderButtons';

import { Container, Content, Footer } from './Layout.styles';

export function Layout({
  children,
  header,
  hasFooter,
}: PropsWithChildren<PropTypes>) {
  const connectWalletsButtonDisabled =
    useUiStore.use.connectWalletsButtonDisabled();
  const navigate = useNavigate();

  const onConnectWallet = () => {
    if (!connectWalletsButtonDisabled) {
      navigate(navigationRoutes.wallets);
    }
  };

  return (
    <Container>
      <Header
        prefix={<>{header.onBack && <BackButton onClick={header.onBack} />}</>}
        title={header.title}
        suffix={
          <>
            {header.suffix}
            {header.hasConnectWallet && (
              <WalletButton onClick={onConnectWallet} />
            )}
            {header.onCancel && <CancelButton onClick={header.onCancel} />}
          </>
        }
      />
      <Content>{children}</Content>
      {hasFooter && (
        <Footer>
          <BottomLogo />
        </Footer>
      )}
    </Container>
  );
}
