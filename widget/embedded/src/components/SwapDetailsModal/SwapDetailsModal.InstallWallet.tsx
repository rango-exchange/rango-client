import type { InstallWalletContentProps } from './SwapDetailsModal.types';

import { i18n } from '@lingui/core';
import { Button, Divider, Image, MessageBox, WarningIcon } from '@arlert-dev/ui';
import { useWallets } from '@arlert-dev/wallets-react';
import { detectInstallLink } from '@arlert-dev/wallets-shared';
import React from 'react';

import {
  WalletIcon,
  WalletIconBadgeContainer,
} from './SwapDetailsModal.styles';

export const InstallWalletContent = (props: InstallWalletContentProps) => {
  const { walletType } = props;

  const { getWalletInfo } = useWallets();

  const walletInfo = walletType ? getWalletInfo(walletType) : null;

  if (!walletInfo) {
    return null;
  }

  const handleButtonClick = () =>
    window.open(detectInstallLink(walletInfo.installLink), '_blank');

  return (
    <>
      <MessageBox
        type="warning"
        title={i18n.t('Install {wallet}', { wallet: walletInfo.name })}
        description="Your wallet is not installed. Please install it to continue the swap.  "
        icon={
          <WalletIcon>
            <Image src={walletInfo.img} size={45} />
            <WalletIconBadgeContainer>
              <WarningIcon color="warning" size={10} />
            </WalletIconBadgeContainer>
          </WalletIcon>
        }
      />
      <Divider size="40" />
      <Button
        type="primary"
        id="widget-install-wallet-btn"
        onClick={handleButtonClick}>
        {i18n.t('Install')}
      </Button>
    </>
  );
};
