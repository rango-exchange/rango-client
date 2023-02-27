import {
  WalletType,
  WalletSigners,
  defaultSigners,
} from '@rango-dev/wallets-shared';

export default function getSigners(provider: any): WalletSigners {
  return defaultSigners({
    provider,
    walletType: WalletType.PHANTOM,
    supportSolana: true,
  });
}
