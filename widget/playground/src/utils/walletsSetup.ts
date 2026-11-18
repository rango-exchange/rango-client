import type { ProvidersOptions } from '@rango-dev/provider-all';
import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { WalletTypes } from '@rango-dev/provider-all';

export function getProvidersOptions(config: WidgetConfig): ProvidersOptions {
  return {
    [WalletTypes.WALLET_CONNECT_2]: config.walletConnectProjectId
      ? { WC_PROJECT_ID: config.walletConnectProjectId }
      : undefined,
    [WalletTypes.TREZOR]: config.trezorManifest
      ? { manifest: config.trezorManifest }
      : undefined,
    [WalletTypes.TON_CONNECT]: config.tonConnect?.manifestUrl
      ? { manifestUrl: config.tonConnect.manifestUrl }
      : undefined,
  };
}
