import type { Connect } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';

export function phantom() {
  if ('phantom' in window) {
    const instances = new Map();

    if (window.phantom?.solana?.isPhantom) {
      instances.set(Networks.SOLANA, window.phantom.solana);
    }

    if (window.phantom?.bitcoin?.isPhantom) {
      instances.set(Networks.BTC, window.phantom.bitcoin);
    }

    return instances;
  }

  return null;
}

export const getBitcoinAccounts: Connect = async ({ instance }) => {
  const accounts = await instance.requestAccounts();
  return {
    accounts: accounts.map(
      (account: {
        address: string;
        publicKey: string;
        addressType: 'p2tr' | 'p2wpkh' | 'p2sh' | 'p2pkh';
        purpose: 'payment' | 'ordinals';
      }) => account.address
    ),
    chainId: Networks.BTC,
  };
};
