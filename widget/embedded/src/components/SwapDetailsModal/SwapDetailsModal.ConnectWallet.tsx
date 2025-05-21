import type { ConnectWalletContentProps } from './SwapDetailsModal.types';

import { i18n } from '@lingui/core';
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Image,
  MessageBox,
  Spinner,
  WarningIcon,
} from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React, { useState } from 'react';

import { useWalletList } from '../../hooks/useWalletList';
import { useUiStore } from '../../store/ui';
import { getConciseAddress } from '../../utils/wallets';
import { NamespaceItem } from '../NamespaceItem';

import {
  WalletIcon,
  WalletIconBadgeContainer,
} from './SwapDetailsModal.styles';

export const ConnectWalletContent = (props: ConnectWalletContentProps) => {
  const { wallet: currentStepWallet, namespace, onClose } = props;

  const [error, setError] = useState<Error | null>(null);
  const { list } = useWalletList();
  const isActiveTab = useUiStore.use.isActiveTab();
  const { state, connect } = useWallets();

  const wallet = list.find(
    (wallet) => wallet.type === currentStepWallet.walletType
  );
  const namespaceData = wallet?.needsNamespace?.data.find(
    (namespaceData) => namespaceData.value === namespace?.namespace
  );

  const walletState = state(currentStepWallet.walletType);
  const namespaceState =
    wallet?.isHub && namespace?.namespace
      ? walletState.namespaces?.get(namespace.namespace)
      : null;
  const firstAccountArray = wallet?.isHub
    ? namespaceState?.accounts?.[0]?.split(':')
    : walletState?.accounts?.[0]?.split(':');
  const address = firstAccountArray?.[firstAccountArray?.length - 1];

  const legacyWalletIsConnecting =
    wallet && !wallet.isHub && walletState.connecting;
  const legacyWalletIsConnected =
    wallet && !wallet.isHub && walletState.connected;
  const hubWalletIsConnecting =
    wallet && wallet.isHub && namespaceState?.connecting;
  const hubWalletIsConnected =
    wallet && wallet.isHub && namespaceState?.connected;
  const walletOrRequiredNamespaceIsConnected =
    hubWalletIsConnected || legacyWalletIsConnected;

  if (!wallet) {
    return null;
  }

  const getButtonTitle = () => {
    if (walletOrRequiredNamespaceIsConnected) {
      return i18n.t('Done');
    }
    if (error) {
      return i18n.t('Try again');
    }
    return i18n.t('Connect');
  };

  const getNamespaceSuffix = () => {
    if (hubWalletIsConnecting) {
      return <Spinner color="info" />;
    } else if (error || hubWalletIsConnected) {
      return null;
    }
    return <Checkbox checked disabled />;
  };

  const handleClickButton = async () => {
    if (walletOrRequiredNamespaceIsConnected) {
      onClose();
      return;
    }

    try {
      setError(null);
      await connect(
        wallet.type,
        namespace?.namespace
          ? [
              {
                namespace: namespace?.namespace,
                network: undefined,
                derivationPath: currentStepWallet.derivationPath,
              },
            ]
          : undefined
      );
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <>
      <MessageBox
        type="warning"
        title={i18n.t('Connect {wallet}', { wallet: wallet.title })}
        description={i18n.t(
          'The connection of your wallet or some networks has been disconnected. Connect to continue the swap'
        )}
        icon={
          <WalletIcon>
            <Image src={wallet.image} size={45} />
            <WalletIconBadgeContainer>
              <WarningIcon color="warning" size={10} />
            </WalletIconBadgeContainer>
          </WalletIcon>
        }
      />
      {legacyWalletIsConnected && !namespaceData && (
        <>
          <Divider size={10} />
          <Alert
            type="success"
            title={i18n.t('Wallet connected successfully.')}
          />
        </>
      )}
      {!wallet.isHub && error && !namespaceData && (
        <>
          <Divider size={10} />
          <Alert type="error" title={error.message} />
        </>
      )}
      {namespaceData && (
        <>
          <Divider size={30} />
          <NamespaceItem
            namespace={namespaceData}
            suffix={getNamespaceSuffix()}
            error={(error?.cause as Error)?.message || error?.message}
            connected={walletOrRequiredNamespaceIsConnected}
            address={
              walletOrRequiredNamespaceIsConnected && address
                ? getConciseAddress(address)
                : ''
            }
          />
        </>
      )}
      <Divider size="40" />
      <Button
        loading={legacyWalletIsConnecting}
        type="primary"
        id="widget-connect-wallet-btn"
        onClick={handleClickButton}
        disabled={!isActiveTab}>
        {getButtonTitle()}
      </Button>
    </>
  );
};
