import { Provider as CoreProvider } from '@rango-dev/wallets-core';

export * from './legacy/helpers';
export { default as Provider } from './provider';
export { useWallets } from './legacy/hooks';
export * from './legacy/types';

export type { EventHandler } from '@rango-dev/wallets-core';
export { Events, readAccountAddress } from '@rango-dev/wallets-core';

export const Core = {
  Provider: CoreProvider,
};
