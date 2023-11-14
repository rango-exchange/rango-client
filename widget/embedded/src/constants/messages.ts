import { i18n } from '@lingui/core';

export const swapButtonTitles = () => {
  return {
    connectWallet: i18n.t('Connect Wallet'),
    swap: i18n.t('Swap'),
    swapAnyway: i18n.t('Swap anyway'),
    ethWarning: i18n.t('The route goes through Ethereum. Continue?'),
  };
};
