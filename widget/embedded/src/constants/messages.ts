import { i18n } from '@lingui/core';

export const swapButtonTitles = () => {
  return {
    connectWallet: i18n.t('Connect Wallet'),
    selectToken: i18n.t('Select Token'),
    enterAmount: i18n.t('Enter Amount'),
    swap: i18n.t('Confirm Swap'),
    swapAnyway: i18n.t('Swap anyway'),
    ethWarning: i18n.t('The route goes through Ethereum. Continue?'),
  };
};
