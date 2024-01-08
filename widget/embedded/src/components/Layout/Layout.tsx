import type { PropTypes, Ref } from './Layout.types';
import type { PropsWithChildren } from 'react';

import { BottomLogo, Divider, Header } from '@rango-dev/ui';
import React, { useEffect, useImperativeHandle, useRef } from 'react';

import { RANGO_SWAP_BOX_ID } from '../../constants';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';
import { useUiStore } from '../../store/ui';
import { useWalletsStore } from '../../store/wallets';
import { getContainer } from '../../utils/common';
import { isFeatureHidden } from '../../utils/settings';
import { BackButton, CancelButton, WalletButton } from '../HeaderButtons';

import { Container, Content, Footer } from './Layout.styles';

function LayoutComponent(props: PropsWithChildren<PropTypes>, outerRef: Ref) {
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

  const innerRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(outerRef, () => innerRef.current!, []);

  useEffect(() => {
    if (innerRef.current) {
      if (fixedHeight) {
        innerRef.current.style.height = '700px';
        window.parent.postMessage(
          {
            type: 'dimensionsChanged',
            height: '700px',
          },
          /*
           * Due to cross-origin restrictions, it is necessary to transmit the parent URL to the iframe.
           * We can dynamically post the parent URL to the iframe within the parent context, eliminating the need for hardcoding this value.
           */
          'http://localhost:3000'
        );
      } else {
        innerRef.current.style.height = 'auto !important';
        window.parent.postMessage(
          {
            type: 'dimensionsChanged',
            height: innerRef.current.clientHeight + 'px',
          },
          'http://localhost:3000'
        );
      }
    }
  }, [fixedHeight]);

  return (
    <Container ref={innerRef} id={RANGO_SWAP_BOX_ID} className={activeTheme()}>
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
