import { getNoirWallet } from '@noir-wallet/sdk';

export const getInstanceOrThrow = () => {
  const noirWallet = getNoirWallet();
  if (!noirWallet) {
    throw new Error('Noir Wallet not installed');
  }
  return noirWallet;
};
