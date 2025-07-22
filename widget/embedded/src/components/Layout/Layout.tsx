import type { PropTypes } from './Layout.types';
import type { PendingSwap } from 'rango-types';
import type { PropsWithChildren } from 'react';

import { useManager } from '@arlert-dev/queue-manager-react';
import { BottomLogo, Divider, Header } from '@arlert-dev/ui';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { WIDGET_UI_ID } from '../../constants';
import { useIframe } from '../../hooks/useIframe';
import { isAppLoadedIntoIframe } from '../../hooks/useIframe/useIframe.helpers';
import { useNavigateBack } from '../../hooks/useNavigateBack';
import useScreenDetect from '../../hooks/useScreenDetect';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/AppStore';
import { tabManager, useUiStore } from '../../store/ui';
import { getContainer } from '../../utils/common';
import { getPendingSwaps } from '../../utils/queue';
import { isFeatureHidden } from '../../utils/settings';
import { ActivateTabAlert } from '../common/ActivateTabAlert';
import { ActivateTabModal } from '../common/ActivateTabModal';
import { BackButton, CancelButton, WalletButton } from '../HeaderButtons';
import { RefreshModal } from '../RefreshModal';

import {
  COMPACT_TOKEN_SELECTOR_THRESHOLD,
  WIDGET_MAX_HEIGHT,
} from './Layout.constants';
import { onScrollContentAttachStatusToContainer } from './Layout.helpers';
import {
  BannerContainer,
  Container,
  Content,
  Footer,
  LayoutContainer,
} from './Layout.styles';

function Layout(props: PropsWithChildren<PropTypes>) {
  const { connectHeightObserver, disconnectHeightObserver } = useIframe();
  const { children, header, footer, height = 'fixed' } = props;
  const {
    fetchStatus,
    connectedWallets,
    config: { __UNSTABLE_OR_INTERNAL__ },
  } = useAppStore();
  const [openRefreshModal, setOpenRefreshModal] = useState(false);
  const {
    config: { features, theme },
  } = useAppStore();
  const { watermark, setShowCompactTokenSelector } = useUiStore();

  const hasWatermark = watermark === 'FULL';
  const { activeTheme } = useTheme(theme || {});
  const [showBanner, setShowBanner] = useState(false);

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
  const { isTablet, isMobile } = useScreenDetect();
  const pendingSwaps: PendingSwap[] = getPendingSwaps(manager).map(
    ({ swap }) => swap
  );
  const hasRunningSwap = pendingSwaps.some((swap) => swap.status === 'running');

  const onActivateTab = () =>
    activateCurrentTab(tabManager.forceClaim, hasRunningSwap);

  const onConnectWallet = () => {
    header.onWallet?.();
  };

  const showBackButton =
    typeof header.hasBackButton === 'undefined' || header.hasBackButton;

  const scrollViewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noRoutesAvailable =
      (__UNSTABLE_OR_INTERNAL__?.swapBoxBanner?.routes?.length ?? 0) === 0;
    const routesMatched =
      !!__UNSTABLE_OR_INTERNAL__?.swapBoxBanner?.routes?.some((route) =>
        location.pathname.endsWith(route)
      );

    setShowBanner(
      !!__UNSTABLE_OR_INTERNAL__?.swapBoxBanner &&
        (noRoutesAvailable || routesMatched)
    );
  }, [
    __UNSTABLE_OR_INTERNAL__?.swapBoxBanner?.routes?.toString(),
    location.pathname,
  ]);

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

  useEffect(() => {
    setOpenRefreshModal(fetchStatus === 'failed');
  }, [fetchStatus]);

  useLayoutEffect(() => {
    const isFixedHeight =
      height === 'auto' || !containerRef.current || isAppLoadedIntoIframe();
    const isSmallScreen = isMobile || isTablet;

    const handler = () => {
      if (isFixedHeight) {
        return;
      }

      if (isSmallScreen) {
        containerRef.current.style.height = `${
          window.innerHeight - containerRef.current.offsetTop
        }px`;
      } else {
        containerRef.current.style.height = `${WIDGET_MAX_HEIGHT}px`;
      }

      setShowCompactTokenSelector(
        parseFloat(containerRef.current.style.height) <
          COMPACT_TOKEN_SELECTOR_THRESHOLD
      );
    };

    handler();

    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, [height, isMobile, isTablet]);

  return (
    <Container
      height={height}
      id={WIDGET_UI_ID.SWAP_BOX_ID}
      className={`${activeTheme()} ${LayoutContainer()}`}
      ref={containerRef}
      showBanner={showBanner}>
      <Header
        prefix={
          showBackButton ? (
            <BackButton
              onClick={() => {
                navigateBack();
                // As an example, used in routes page to add a custom logic when navigating back to the home page.
                header.onBack?.();
              }}
            />
          ) : null
        }
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

      <Footer>
        <div className="footer__content">
          {tabManagerInitiated && !isActiveTab && (
            <div className="footer__alert">
              <ActivateTabAlert onActivateTab={onActivateTab} />
              <Divider size={10} />
            </div>
          )}
          {footer}
        </div>

        <Divider size={12} />

        <div
          className={`footer__logo ${
            hasWatermark ? 'logo__show' : 'logo__hidden'
          }`}>
          <BottomLogo />
        </div>
      </Footer>
      {showBanner && (
        <BannerContainer>
          {__UNSTABLE_OR_INTERNAL__?.swapBoxBanner?.element}
        </BannerContainer>
      )}
      <RefreshModal
        open={openRefreshModal}
        onClose={() => setOpenRefreshModal(false)}
      />
    </Container>
  );
}
export { Layout };
