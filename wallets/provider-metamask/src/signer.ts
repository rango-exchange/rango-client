import {
  WalletType,
  WalletSigners,
  defaultSigners,
} from '@rango-dev/wallets-shared';

export default function getSigners(provider: any): WalletSigners {
  return defaultSigners({
    walletType: WalletType.META_MASK,
    provider,
    supportEvm: true,
  });
}
