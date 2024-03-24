import { Provider as CoreProvider } from '@rango-dev/wallets-core';

export * from './v0/helpers';
export { default as Provider } from './provider';
export { useWallets } from './v0/hooks';
export * from './v0/types';

export type { EventHandler } from '@rango-dev/wallets-core';
export { Events, readAccountAddress } from '@rango-dev/wallets-core';

export const Core = {
  Provider: CoreProvider,
};
