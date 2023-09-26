import type { PropTypes } from './Layout.types';
import type { PropsWithChildren } from 'react';

import { BottomLogo, Divider, Header, theme } from '@rango-dev/ui';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { navigationRoutes } from '../../constants/navigationRoutes';
import { useUiStore } from '../../store/ui';
import { useWalletsStore } from '../../store/wallets';
import { BackButton, CancelButton, WalletButton } from '../HeaderButtons';

import { Container, Content, Footer } from './Layout.styles';

const DEFAULT_CONTENT_PADDING = 20;

export function Layout(props: PropsWithChildren<PropTypes>) {
  const {
    children,
    header,
    hasLogo = true,
    footer,
    fixedHeight = true,
  } = props;

  const connectedWallets = useWalletsStore.use.connectedWallets();

  const connectWalletsButtonDisabled =
    useUiStore.use.connectWalletsButtonDisabled();
  const navigate = useNavigate();

  const contentRef = useRef<HTMLDivElement | null>(null);

  const onConnectWallet = () => {
    if (!connectWalletsButtonDisabled) {
      navigate('/' + navigationRoutes.wallets);
    }
  };

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (contentRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (contentRef.current) {
          const scrollable =
            contentRef.current?.scrollHeight > contentRef.current?.clientHeight;
          if (scrollable) {
            contentRef.current.style.paddingRight = `${
              parseInt(theme.sizes[DEFAULT_CONTENT_PADDING]) -
              (contentRef.current.offsetWidth - contentRef.current.clientWidth)
            }px`;
          } else {
            contentRef.current.style.paddingRight =
              theme.sizes[DEFAULT_CONTENT_PADDING];
          }
        }
      });
      resizeObserver.observe(contentRef.current);
    }
    return () => {
      if (contentRef.current) {
        resizeObserver?.unobserve(contentRef.current);
      }
    };
  }, [contentRef.current]);

  return (
    <Container fixedHeight={fixedHeight} id="swap-box">
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
      <Content ref={(ref) => (contentRef.current = ref)}>{children}</Content>
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
