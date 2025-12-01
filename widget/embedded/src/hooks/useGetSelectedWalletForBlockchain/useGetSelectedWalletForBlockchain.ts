import { useWallets } from '@rango-dev/wallets-react';

import { useAppStore } from '../../store/AppStore';

export function useGetSelectedWalletForBlockchain() {
  const { selectedWallet } = useAppStore();
  const { getWalletInfo } = useWallets();

  const getSelectedWalletInfo = (blockchain: string) => {
    const candidates = [
      selectedWallet('source'),
      selectedWallet('destination'),
      selectedWallet('route')?.[blockchain],
    ];

    const matchedWallet = candidates.find(
      (wallet) => wallet && wallet.chain === blockchain
    );

    return matchedWallet ? getWalletInfo(matchedWallet.walletType) : null;
  };

  return { getSelectedWalletInfo };
}
