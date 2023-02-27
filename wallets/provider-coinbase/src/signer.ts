import {
  WalletType,
  WalletSigners,
  defaultSigners,
} from '@rango-dev/wallets-shared';

export default function getSigners(provider: any): WalletSigners {
  return defaultSigners({
    walletType: WalletType.COINBASE,
    provider,
    supportEvm: true,
    supportSolana: true,
  });
}
