import type { ProviderConfig, ProviderInfo } from '../hub/store/mod.js';

export const garbageWalletMetaData: ProviderConfig['metadata'] = {
  name: 'Garbage Wallet',
  icon: 'https://somewhereininternet.com/icon.svg',
  extensions: {
    homepage: 'https://app.rango.exchange',
  },
};
export const garbageWalletDeepLink: ProviderConfig['deepLink'] = () =>
  'garbage link';
export const garbageWalletInfo: ProviderInfo = {
  metadata: garbageWalletMetaData,
  deepLink: garbageWalletDeepLink,
};
