import {
  WalletType,
  defaultSigners,
  WalletSigners,
} from '@rangodev/wallets-shared';

export default function getSigners(provider: any): WalletSigners {
  return defaultSigners({
    provider,
    walletType: WalletType.WALLET_CONNECT,
    supportEvm: true,
  });
}
