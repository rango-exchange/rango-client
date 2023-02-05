import {
  WalletType,
  WalletSigners,
  defaultSigners,
} from '@rangodev/wallets-shared';

export default function getSigners(provider: any): WalletSigners {
  return defaultSigners({
    walletType: WalletType.LEAP,
    provider,
    supportCosmos: true,
  });
}
