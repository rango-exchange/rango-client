import type { SelectedWallet } from './types';
import type { SwapWallet } from '../execution/types';

export function toSwapWallets(
  selectedWallets: SelectedWallet[]
): Record<string, SwapWallet> {
  return Object.fromEntries(
    selectedWallets.map((wallet) => [
      wallet.chain,
      {
        walletType: wallet.walletType,
        address: wallet.address,
        derivationPath: wallet.derivationPath,
      },
    ])
  );
}

/** The chain-to-address map the confirm endpoint expects. */
export function toAddressMap(
  selectedWallets: SelectedWallet[]
): Record<string, string> {
  return Object.fromEntries(
    selectedWallets.map((wallet) => [wallet.chain, wallet.address])
  );
}
