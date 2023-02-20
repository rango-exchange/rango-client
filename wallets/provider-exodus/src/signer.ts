import {
  WalletType,
  WalletSigners,
  defaultSigners,
} from '@rangodev/wallets-shared';

export default function getSigners(provider: any): WalletSigners {
  return defaultSigners({
    provider,
    walletType: WalletType.EXODUS,
    supportEvm: true,
    supportSolana: true,
  });
}
