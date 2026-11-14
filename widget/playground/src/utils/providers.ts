import type { PlaygroundConfig } from '../store/config';
import type { Provider } from '@hub3js/core';

import { allProviders, WalletTypes } from '@rango-dev/provider-all';

const REQUIRED_CONFIG_BY_WALLET: Partial<
  Record<string, keyof PlaygroundConfig>
> = {
  [WalletTypes.LEDGER_WALLET]: 'ledgerWallet',
  [WalletTypes.TREZOR]: 'trezorManifest',
  [WalletTypes.TON_CONNECT]: 'tonConnect',
  [WalletTypes.WALLET_CONNECT_2]: 'walletConnectProjectId',
};

function hasRequiredConfig(walletId: string, config: PlaygroundConfig) {
  const requiredKey = REQUIRED_CONFIG_BY_WALLET[walletId];
  if (!requiredKey || config[requiredKey]) {
    return true;
  }

  console.warn(
    `${walletId} is listed in config wallets but ${requiredKey} config is not provided!`
  );
  return false;
}

let providers: Provider[] | undefined;

// Providers hold state, so they're built once for the whole playground session.
export function getProviders(): Provider[] {
  if (!providers) {
    providers = allProviders().map((build) => build());
  }
  return providers;
}

export function selectProviders(config: PlaygroundConfig): Provider[] {
  return getProviders().filter(
    (provider) =>
      (!config.wallets || config.wallets.includes(provider.id)) &&
      hasRequiredConfig(provider.id, config)
  );
}
