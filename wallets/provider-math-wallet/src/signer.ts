import {
  WalletType,
  WalletSigners,
  defaultSigners,
} from '@rangodev/wallets-shared';

export default function getSigners(provider: any): WalletSigners {
  return defaultSigners({
    walletType: WalletType.MATH,
    provider,
    supportEvm: true,
    supportSolana: true,
  });
}
