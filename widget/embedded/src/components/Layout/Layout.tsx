import type { PropTypes } from './Layout.types';
import type { PendingSwap } from 'rango-types';
import type { PropsWithChildren } from 'react';

import { useManager } from '@rango-dev/queue-manager-react';
import { BottomLogo, Divider, Header } from '@rango-dev/ui';
import React, { useEffect, useRef } from 'react';

import { WIDGET_UI_ID } from '../../constants';
import { useIframe } from '../../hooks/useIframe';
import { isAppLoadedIntoIframe } from '../../hooks/useIframe/useIframe.helpers';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';
import { setCurrentTabAsActive, useUiStore } from '../../store/ui';
import { useWalletsStore } from '../../store/wallets';
import { getContainer } from '../../utils/common';
import { getPendingSwaps } from '../../utils/queue';
import { isFeatureHidden } from '../../utils/settings';
import { ActivateTabAlert } from '../common/ActivateTabAlert';
import { ActivateTabModal } from '../common/ActivateTabModal';
import { BackButton, CancelButton, WalletButton } from '../HeaderButtons';

import { onScrollContentAttachStatusToContainer } from './Layout.helpers';
import { Container, Content, Footer } from './Layout.styles';

function Layout(props: PropsWithChildren<PropTypes>) {
  const { children, header, footer, hasLogo = true, height = 'fixed' } = props;
  const { connectHeightObserver, disconnectHeightObserver } = useIframe();
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const {
    config: { features, theme },
  } = useAppStore();
  const { activeTheme } = useTheme(theme || {});

  const isConnectWalletHidden = isFeatureHidden(
    'connectWalletButton',
    features
  );

  const {
    isActiveTab,
    tabManagerInitiated,
    showActivateTabModal,
    setShowActivateTabModal,
    activateCurrentTab,
  } = useUiStore();
  const navigateBack = useNavigateBack();
  const { manager } = useManager();
  const pendingSwaps: PendingSwap[] = getPendingSwaps(manager).map(
    ({ swap }) => swap
  );
  const hasRunningSwap = pendingSwaps.some((swap) => swap.status === 'running');

  const onActivateTab = () =>
    activateCurrentTab(setCurrentTabAsActive, hasRunningSwap);

  const onConnectWallet = () => {
    header.onWallet?.();
  };

  const showBackButton =
    typeof header.hasBackButton === 'undefined' || header.hasBackButton;

  const scrollViewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isIframe = isAppLoadedIntoIframe();

    // This feature only will be available in an iframe context.
    if (isIframe && containerRef.current) {
      connectHeightObserver(containerRef.current);
    }

    return () => {
      disconnectHeightObserver();
    };
  }, []);

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
    <Container
      height={height}
      id={WIDGET_UI_ID.SWAP_BOX_ID}
      className={activeTheme()}
      ref={containerRef}>
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
      <ActivateTabModal
        open={showActivateTabModal}
        onClose={() => setShowActivateTabModal(false)}
        onConfirm={onActivateTab}
      />
      {(hasLogo || footer) && (
        <Footer>
          <div className="footer__content">
            {footer}
            {tabManagerInitiated && !isActiveTab && (
              <>
                <Divider size={12} />
                <ActivateTabAlert onActivateTab={onActivateTab} />
              </>
            )}
          </div>
          <Divider size={12} />
          {hasLogo && (
            <div className="footer__logo">
              <BottomLogo />
            </div>
          )}
        </Footer>
      )}
    </Container>
  );
}
export { Layout };
