import type { WalletStateContentProps } from './SwapDetailsModal.types';

import {
  getCurrentNamespaceOfOrNull,
  getCurrentStep,
  getRelatedWalletOrNull,
} from '@rango-dev/queue-manager-rango-preset';
import { WalletState } from '@rango-dev/ui';
import { useWallets } from '@rango-dev/wallets-react';
import React from 'react';

import { getWalletConnectionStatus } from '../../utils/wallets';

import { ConnectWalletContent } from './SwapDetailsModal.ConnectWallet';
import { InstallWalletContent } from './SwapDetailsModal.InstallWallet';

export const WalletStateContent = (props: WalletStateContentProps) => {
  const { swap, onClose } = props;
  const { state, getWalletInfo } = useWallets();

  const currentStep = getCurrentStep(swap);
  const currentStepWallet = currentStep
    ? getRelatedWalletOrNull(swap, currentStep)
    : null;

  const walletType = currentStepWallet?.walletType;
  const walletState = walletType
    ? getWalletConnectionStatus(getWalletInfo(walletType), state(walletType))
    : null;
  const currentNamespace = currentStep
    ? getCurrentNamespaceOfOrNull(swap, currentStep)
    : null;

  if (!walletType) {
    return null;
  }

  if (walletState === WalletState.NOT_INSTALLED) {
    return <InstallWalletContent walletType={walletType} />;
  }

  return (
    <ConnectWalletContent
      wallet={currentStepWallet}
      namespace={currentNamespace}
      onClose={onClose}
    />
  );
};
