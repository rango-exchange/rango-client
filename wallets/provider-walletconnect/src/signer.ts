import {
  WalletType,
  defaultSigners,
  WalletSigners,
} from '@rango-dev/wallets-shared';

export default function getSigners(provider: any): WalletSigners {
  return defaultSigners({
    provider,
    walletType: WalletType.WALLET_CONNECT,
    supportEvm: true,
  });
}
