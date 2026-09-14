import type { Provider, WalletType } from '@hub3js/core';

export const isWalletExcluded = (
  providers: (WalletType | Provider)[],
  wallet: { name: string; type: WalletType }
) => {
  return (
    providers.length &&
    !providers.find((provider) => {
      if (typeof provider === 'string') {
        return provider === wallet.type;
      }
      return provider.id === wallet.type;
    })
  );
};

export const lazyProvider = (provider: Provider) => () => provider;
